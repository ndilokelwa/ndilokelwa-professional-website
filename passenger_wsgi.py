"""
WSGI entry point for Spaceship shared hosting (cPanel Setup Python App / Passenger).

In Setup Python App:
  - Application startup file: passenger_wsgi.py
  - Application Entry point: application
"""
import os
import sys
import traceback

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
if APP_ROOT not in sys.path:
    sys.path.insert(0, APP_ROOT)

os.chdir(APP_ROOT)


def _write_error(exc: BaseException) -> str:
    text = traceback.format_exc()
    log_path = os.path.join(APP_ROOT, "passenger_error.log")
    try:
        with open(log_path, "w", encoding="utf-8") as f:
            f.write(text)
    except OSError:
        pass
    return text


try:
    from aggregator import application  # noqa: E402
except Exception as exc:
    error_text = _write_error(exc)

    def application(environ, start_response):
        body = (
            "Passenger failed to start the app.\n\n"
            "See also: passenger_error.log in the application root.\n\n"
            f"{error_text}"
        ).encode("utf-8")
        start_response(
            "500 Internal Server Error",
            [("Content-Type", "text/plain; charset=utf-8"), ("Content-Length", str(len(body)))],
        )
        return [body]
