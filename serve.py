"""Static server for the mockup that disables browser caching, so edits show on every refresh."""
import functools
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


handler = functools.partial(NoCacheHandler, directory="mockup")
with http.server.ThreadingHTTPServer(("", PORT), handler) as httpd:
    print(f"Serving mockup at http://localhost:{PORT}")
    httpd.serve_forever()
