import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = "dist"

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        # Strip query parameters
        raw_path = path.split('?')[0].split('#')[0]
        clean_rel = raw_path.lstrip('/')
        
        # Build absolute path inside DIRECTORY
        full_path = os.path.abspath(os.path.join(os.getcwd(), DIRECTORY, clean_rel))

        # Check if file or index.html exists
        if os.path.isdir(full_path):
            index = os.path.join(full_path, "index.html")
            if os.path.exists(index):
                return index
        elif os.path.exists(full_path):
            return full_path

        # SPA Fallback to index.html for client-side routing
        return os.path.abspath(os.path.join(os.getcwd(), DIRECTORY, "index.html"))

if __name__ == "__main__":
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    os.chdir(root_dir)
    
    # Ensure dist folder exists
    dist_dir = os.path.join(root_dir, DIRECTORY)
    if not os.path.exists(dist_dir):
        print("dist directory missing. Building Vite bundle...")
        os.system("npm run build")

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print("==================================================")
        print(" Starting v3.0 3D Portfolio Local Server")
        print(f" Serving directory: {DIRECTORY}")
        print(f" Local URL: http://localhost:{PORT}")
        print("==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
