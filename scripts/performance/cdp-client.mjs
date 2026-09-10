import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export class CdpClient {
    constructor(webSocketUrl) {
        this.webSocketUrl = webSocketUrl;
        this.socket = null;
        this.nextId = 1;
        this.pending = new Map();
        this.listeners = new Map();
    }

    async connect() {
        this.socket = new WebSocket(this.webSocketUrl);
        await new Promise((resolve, reject) => {
            this.socket.addEventListener('open', resolve, { once: true });
            this.socket.addEventListener('error', reject, { once: true });
        });
        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(event.data);
            if (message.id) {
                const pending = this.pending.get(message.id);
                if (!pending) return;
                this.pending.delete(message.id);
                if (message.error) pending.reject(new Error(`${pending.method}: ${message.error.message}`));
                else pending.resolve(message.result);
                return;
            }
            const handlers = this.listeners.get(message.method);
            if (handlers) handlers.forEach((handler) => handler(message.params));
        });
        const rejectPending = (reason) => {
            for (const pending of this.pending.values()) pending.reject(reason);
            this.pending.clear();
        };
        this.socket.addEventListener('close', () => rejectPending(new Error('Chrome DevTools connection closed')));
        this.socket.addEventListener('error', () => rejectPending(new Error('Chrome DevTools connection failed')));
        return this;
    }

    send(method, params = {}) {
        const id = this.nextId++;
        return new Promise((resolve, reject) => {
            this.pending.set(id, { method, resolve, reject });
            this.socket.send(JSON.stringify({ id, method, params }));
        });
    }

    on(method, handler) {
        if (!this.listeners.has(method)) this.listeners.set(method, new Set());
        this.listeners.get(method).add(handler);
        return () => this.listeners.get(method)?.delete(handler);
    }

    once(method, timeoutMs = 30_000) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                unsubscribe();
                reject(new Error(`Timed out waiting for ${method}`));
            }, timeoutMs);
            const unsubscribe = this.on(method, (params) => {
                clearTimeout(timeout);
                unsubscribe();
                resolve(params);
            });
        });
    }

    close() {
        this.socket?.close();
    }
}

const waitForDevToolsPort = async (profileDirectory, process, timeoutMs = 15_000) => {
    const portFile = path.join(profileDirectory, 'DevToolsActivePort');
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
        if (process.exitCode !== null) throw new Error(`Chrome exited with code ${process.exitCode}`);
        try {
            const [port] = (await readFile(portFile, 'utf8')).trim().split(/\r?\n/);
            if (port) return Number(port);
        } catch {
            // Chrome creates the file only after the DevTools endpoint is ready.
        }
        await sleep(50);
    }
    throw new Error('Timed out waiting for Chrome DevTools endpoint');
};

export const launchChrome = async ({ chromePath, width, height }) => {
    const profileDirectory = await mkdtemp(path.join(tmpdir(), 'portfolio-perf-'));
    const chromeProcess = spawn(
        chromePath,
        [
            '--headless=new',
            '--remote-debugging-port=0',
            `--user-data-dir=${profileDirectory}`,
            `--window-size=${width},${height}`,
            '--force-device-scale-factor=1',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-background-networking',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-features=Translate,MediaRouter,OptimizationHints',
            '--disable-sync',
            '--metrics-recording-only',
            '--password-store=basic',
            '--use-mock-keychain',
            'about:blank',
        ],
        { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true }
    );

    let stderr = '';
    chromeProcess.stderr.on('data', (chunk) => {
        stderr += chunk.toString();
    });

    const port = await waitForDevToolsPort(profileDirectory, chromeProcess);
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const pageTarget = targets.find((target) => target.type === 'page');
    if (!pageTarget?.webSocketDebuggerUrl) {
        throw new Error(`Chrome page target unavailable. ${stderr}`);
    }

    const client = await new CdpClient(pageTarget.webSocketDebuggerUrl).connect();
    const close = async () => {
        const exited = new Promise((resolve) => {
            if (chromeProcess.exitCode !== null) resolve(chromeProcess.exitCode);
            else chromeProcess.once('exit', resolve);
        });
        try {
            // Chrome can close its DevTools socket without acknowledging
            // Browser.close. Bound the acknowledgement wait so cleanup cannot
            // leave the benchmark suspended on an unsettled top-level await.
            const closeRequest = client.send('Browser.close').catch(() => undefined);
            await Promise.race([closeRequest, sleep(1_000)]);
        } catch {
            chromeProcess.kill();
        }
        client.close();
        await Promise.race([exited, sleep(2_000)]);
        if (chromeProcess.exitCode === null) {
            chromeProcess.kill();
            await Promise.race([exited, sleep(2_000)]);
        }
        for (let attempt = 0; attempt < 10; attempt += 1) {
            try {
                await rm(profileDirectory, { recursive: true, force: true });
                break;
            } catch (error) {
                if (attempt === 9) throw error;
                await sleep(250);
            }
        }
    };

    return { client, close, chromeProcess, profileDirectory, port };
};
