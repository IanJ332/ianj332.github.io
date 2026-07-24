import os
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ORIGIN = "https://intro3d.com"
CHUNKS_DIR = "v3.0-site/_next/static/chunks"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
}

# Explicitly list missing chunks from client logs
initial_missing = [
    "dda6fbea.e5ae5452deb88313.js",
    "15a40f47.2f7614c01c092dbe.js",
    "e31cea27-90be9eed2aae2d03.js",
    "a16bc91a-ed3e48d98953291b.js",
    "e8b8ea12-aba3c0f739189bac.js",
    "c132bf7d-629820ac34e14e9f.js",
    "655-ee362f40733a820a.js",
    "6810.ca984e2149f090cf.js",
    "8075-e0b10849e3b2345d.js",
    "1277-ca32d7318e7eaf5a.js",
    "3021.c9f507ed081d8d19.js",
    "3027.82f7885e969b9ae7.js",
    "454-2353ef769a538cf5.js",
    "9264.bd5bf2d20d597b6d.js"
]

downloaded = set()

def fetch_and_save(chunk_name):
    clean_name = chunk_name.lstrip("/")
    url = f"{ORIGIN}/_next/static/chunks/{clean_name}"
    
    out_path = os.path.join(CHUNKS_DIR, clean_name)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            with open(out_path, "wb") as f:
                f.write(data)
            print(f"[SUCCESS] Downloaded chunk: {clean_name} ({len(data)} bytes)")
            downloaded.add(clean_name)
            
            # Scan downloaded chunk for more chunks
            try:
                text = data.decode('utf-8', errors='ignore')
                more = set(re.findall(r'["\']([a-zA-Z0-9_\-\.]+\.[a-f0-9]{8,16}\.js)["\']', text))
                more_chunks = set(re.findall(r'["\']([0-9]{3,4}\.[a-f0-9]{8,16}\.js)["\']', text))
                all_new = (more | more_chunks) - downloaded
                for nc in all_new:
                    fetch_and_save(nc)
            except:
                pass
    except Exception as e:
        print(f"[ERROR] Failed to fetch chunk {clean_name}: {e}")

def main():
    print("=== Downloading missing dynamic Next.js chunks ===")
    
    # 1. Download explicit list
    for chunk in initial_missing:
        fetch_and_save(chunk)
        
    # 2. Scan all JS files in v3.0-site for any chunk IDs in webpack manifests
    print("=== Scanning all downloaded JS for any remaining un-fetched chunk IDs ===")
    chunk_pattern = re.compile(r'["\']([a-zA-Z0-9_\-\.]+\.[a-f0-9]{8,16}\.js)["\']')
    
    to_check = set()
    for root, dirs, files in os.walk(CHUNKS_DIR):
        for fname in files:
            if fname.endswith('.js'):
                fpath = os.path.join(root, fname)
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    matches = chunk_pattern.findall(content)
                    for m in matches:
                        if not os.path.exists(os.path.join(CHUNKS_DIR, m)):
                            to_check.add(m)
                            
    print(f"Found {len(to_check)} additional potential chunks to fetch.")
    for c in to_check:
        fetch_and_save(c)

    print("=== All missing dynamic chunks downloaded! ===")

if __name__ == "__main__":
    main()
