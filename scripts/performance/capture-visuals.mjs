import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome, sleep } from './cdp-client.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../..');
const label = process.argv[2] || 'local';
const url = process.argv[3] || 'http://127.0.0.1:4173/';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'laptop', width: 1366, height: 768 },
    { name: 'mobile', width: 390, height: 844 },
];

const evaluate = async (client, expression) => {
    const response = await client.send('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
    });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || 'Evaluation failed');
    return response.result.value;
};

const capture = async (client, outputPath) => {
    const { data } = await client.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
    });
    await writeFile(outputPath, Buffer.from(data, 'base64'));
};

const navigate = async (client) => {
    const loaded = client.once('Page.loadEventFired', 30_000);
    await client.send('Page.navigate', { url: `${url}?visual=${Date.now()}#home` });
    await loaded;
};

for (const viewport of viewports) {
    const outputDirectory = path.join(repositoryRoot, 'performance', 'artifacts', label);
    await mkdir(outputDirectory, { recursive: true });
    const { client, close } = await launchChrome({ chromePath, width: viewport.width, height: viewport.height });
    try {
        await client.send('Page.enable');
        await client.send('Runtime.enable');
        await client.send('Network.enable');
        await client.send('Emulation.setDeviceMetricsOverride', {
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 1,
            mobile: false,
        });
        await client.send('Network.setCacheDisabled', { cacheDisabled: true });
        await navigate(client);

        await sleep(3_000);
        await capture(client, path.join(outputDirectory, `${viewport.name}-hero-t3.png`));
        await sleep(2_000);
        await capture(client, path.join(outputDirectory, `${viewport.name}-hero-t5.png`));

        if (viewport.width >= 768) {
            const target = await evaluate(
                client,
                `(() => {
                    const link = document.querySelector('a[href="#projects"]');
                    const box = link.getBoundingClientRect();
                    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
                })()`
            );
            await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y });
            await sleep(250);
            await capture(client, path.join(outputDirectory, `${viewport.name}-hover.png`));
        }

        await evaluate(
            client,
            `(() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'instant', block: 'start' });
                return scrollY;
            })()`
        );
        await sleep(2_000);
        await capture(client, path.join(outputDirectory, `${viewport.name}-projects.png`));
    } finally {
        await close();
    }
}

console.log(`Visual captures written to performance/artifacts/${label}`);
