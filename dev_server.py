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
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://pagead2.googlesyndication.com https://www.googletagmanager.com https://googleads.g.doubleclick.net blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data: blob: https:; connect-src 'self' blob: https://formsubmit.co https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net; worker-src 'self' blob:; frame-src 'self' blob: https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com; form-action 'self' https://formsubmit.co; object-src 'none'; base-uri 'self';")
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
