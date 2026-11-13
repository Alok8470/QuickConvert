import http.server
import socketserver
import os
from pathlib import Path

ROOT = Path(r"C:/Users/Zexox/Desktop/QuickConvert")
PORT = 3000

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Connection", "close")
        super().end_headers()

    def do_GET(self):
        # Strip query parameters / hashes for path resolution
        path = self.path.split('?')[0].split('#')[0]
        
        if path == "/tools" or path == "/tools/":
            self.send_response(302)
            self.send_header("Location", "/#suite-tools")
            self.end_headers()
            return

        # Exact match or directory
        local_path = (ROOT / path.lstrip('/')).resolve()

        # Check if clean URL matches an existing .html file
        if not local_path.exists() and not path.endswith('.html'):
            html_candidate = ROOT / (path.lstrip('/') + '.html')
            if html_candidate.exists():
                self.path = path + '.html'

        return super().do_GET()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == "__main__":
    with ThreadedHTTPServer(("", PORT), CleanURLHandler) as httpd:
        print(f"Clean URL Dev Server running at http://localhost:{PORT}")
        httpd.serve_forever()
