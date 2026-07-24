import os
import re
import urllib.parse
import urllib.request
import json
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://intro3d.com/u/erdrec10w6"
ORIGIN = "https://intro3d.com"
OUTPUT_DIR = "v3.0-site"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "*/*",
}

visited_urls = set()
download_queue = set()

os.makedirs(OUTPUT_DIR, exist_ok=True)

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content_type = resp.headers.get("Content-Type", "")
            data = resp.read()
            return data, content_type
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url}: {e}")
        return None, ""

def save_file(rel_path, data):
    clean_path = rel_path.lstrip("/")
    if not clean_path or clean_path == "/":
        clean_path = "index.html"
    
    # Strip any trailing query parameters or backslashes in filename
    clean_path = clean_path.split('?')[0].rstrip('\\')
    
    full_path = os.path.join(OUTPUT_DIR, clean_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "wb") as f:
        f.write(data)
    print(f"[SAVED] {clean_path} ({len(data)} bytes)")
    return full_path

def main():
    print(f"=== Starting fetch for {BASE_URL} ===")
    html_data, _ = fetch_url(BASE_URL)
    if not html_data:
        print("[CRITICAL] Could not fetch main page HTML!")
        return

    save_file("index.html", html_data)
    html_str = html_data.decode("utf-8", errors="ignore")
    unescaped_html = html_str.replace('\\/', '/')

    # Find asset URLs
    urls = set(re.findall(r'(?:src|href)=["\']([^"\']+)["\']', unescaped_html))
    next_assets = set(re.findall(r'/_next/static/[^\s"\'\(\)\\]+', unescaped_html))
    urls.update(next_assets)

    media_assets = set(re.findall(r'https?://[^\s"\'\(\)\\]+\.(?:glb|gltf|bin|png|jpg|jpeg|webp|svg|hdr|exr|splinecode|json)', unescaped_html, re.IGNORECASE))
    urls.update(media_assets)
    
    relative_media = set(re.findall(r'/[^\s"\'\(\)\\]+\.(?:glb|gltf|bin|png|jpg|jpeg|webp|svg|hdr|exr|splinecode|json)', unescaped_html, re.IGNORECASE))
    urls.update(relative_media)

    all_to_download = set()
    for u in urls:
        if u.startswith("//"):
            u = "https:" + u
        elif u.startswith("/"):
            u = ORIGIN + u
        elif not u.startswith("http"):
            u = urllib.parse.urljoin(BASE_URL, u)
        all_to_download.add(u)

    print(f"[INFO] Found {len(all_to_download)} initial URLs to download.")

    processed = set()
    
    def process_url(url):
        url_clean = url.split('?')[0].rstrip('\\')
        if url_clean in processed:
            return
        processed.add(url_clean)
        
        parsed = urllib.parse.urlparse(url_clean)
        if parsed.netloc and parsed.netloc != "intro3d.com" and not any(url_clean.endswith(ext) for ext in ['.glb', '.gltf', '.bin', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.hdr', '.exr', '.splinecode']):
            if not ("intro3d.com" in parsed.netloc or "assets.intro3d.com" in parsed.netloc or "github" in parsed.netloc or "unpkg.com" in parsed.netloc or "cdn" in parsed.netloc):
                return

        data, ctype = fetch_url(url_clean)
        if not data:
            return

        if parsed.netloc == "intro3d.com" or not parsed.netloc:
            rel_path = parsed.path
        else:
            rel_path = f"_external/{parsed.netloc}{parsed.path}"

        save_file(rel_path, data)

        if url_clean.endswith(".js") or url_clean.endswith(".css") or "javascript" in ctype or "css" in ctype:
            try:
                text = data.decode("utf-8", errors="ignore").replace('\\/', '/')
                more_next = set(re.findall(r'/_next/static/[^\s"\'\(\)\\]+', text))
                more_files = set(re.findall(r'["\'](/[^"\'\s\\]+\.(?:js|css|glb|gltf|bin|png|jpg|jpeg|webp|svg|hdr|exr|splinecode|json|woff2?|ttf))["\']', text, re.IGNORECASE))
                more_https = set(re.findall(r'https?://[^\s"\'\(\)\\]+\.(?:glb|gltf|bin|png|jpg|jpeg|webp|svg|hdr|exr|splinecode|json|woff2?|ttf)', text, re.IGNORECASE))
                
                new_urls = set()
                for nu in (more_next | more_files | more_https):
                    if nu.startswith("//"):
                        nu = "https:" + nu
                    elif nu.startswith("/"):
                        nu = ORIGIN + nu
                    elif not nu.startswith("http"):
                        nu = urllib.parse.urljoin(url_clean, nu)
                    if nu not in processed:
                        new_urls.add(nu)
                
                for nu in new_urls:
                    process_url(nu)
            except Exception as e:
                print(f"[WARN] Error scanning {url_clean}: {e}")

    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(process_url, list(all_to_download)))

    # Perform thorough path rewrites for index.html and static text files
    print("=== Rewriting paths in index.html & static files ===")
    for root, dirs, files in os.walk(OUTPUT_DIR):
        for fname in files:
            if fname.endswith(('.html', '.js', '.css', '.json')):
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # Compute relative prefix to root based on directory depth
                    rel_to_root = os.path.relpath(OUTPUT_DIR, start=os.path.dirname(fpath))
                    prefix = "." if rel_to_root == "." else rel_to_root

                    # Replace remote asset URLs with local relative paths
                    new_content = content
                    new_content = new_content.replace('https://assets.intro3d.com/', f'{prefix}/_external/assets.intro3d.com/')
                    new_content = new_content.replace('https:\\/\\/assets.intro3d.com\\/', f'{prefix}/_external/assets.intro3d.com/')
                    new_content = new_content.replace('https://intro3d.com/', f'{prefix}/')
                    new_content = new_content.replace('https:\\/\\/intro3d.com\\/', f'{prefix}/')
                    
                    if fname == "index.html":
                        new_content = new_content.replace('href="/_next/', 'href="./_next/')
                        new_content = new_content.replace('src="/_next/', 'src="./_next/')
                        new_content = new_content.replace('"/_next/', '"./_next/')
                        new_content = new_content.replace("'/_next/", "'./_next/")

                    if new_content != content:
                        with open(fpath, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        print(f"[REWRITTEN] {os.path.relpath(fpath, OUTPUT_DIR)}")
                except Exception as e:
                    pass

    print("=== Scraping and path rewrites complete! ===")

if __name__ == "__main__":
    main()
