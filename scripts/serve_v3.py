import http.server
import socketserver
import os
import urllib.parse
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = "v3.0-site"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        translated = super().translate_path(path)
        if os.path.exists(translated):
            return translated
        
        # Try unquoting / quoting variants for Next.js encoded dynamic route paths (e.g. %5Bslug%5D vs [slug])
        raw_path = self.path.split('?')[0]
        
        # Try relative to DIRECTORY directly
        clean_rel = raw_path.lstrip('/')
        dir_path1 = os.path.join(DIRECTORY, clean_rel)
        if os.path.exists(dir_path1):
            return os.path.abspath(dir_path1)

        unquoted_rel = urllib.parse.unquote(clean_rel)
        dir_path2 = os.path.join(DIRECTORY, unquoted_rel)
        if os.path.exists(dir_path2):
            return os.path.abspath(dir_path2)

        quoted_rel = clean_rel.replace('[', '%5B').replace(']', '%5D')
        dir_path3 = os.path.join(DIRECTORY, quoted_rel)
        if os.path.exists(dir_path3):
            return os.path.abspath(dir_path3)

        return translated

if __name__ == "__main__":
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(root_dir)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print("==================================================")
        print(" Starting v3.0 3D Portfolio Local Server")
        print(f" Serving directory: {DIRECTORY}")
        print(f" Local URL: http://localhost:{PORT}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
