# aggregator.py
import os
from flask import Flask, send_from_directory
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

from proj.iris.app import app as app1

site = Flask(__name__, static_folder='.', static_url_path='')

@site.route("/")
def root_index():
    return send_from_directory(".", "index.html")

@site.route("/about.html")
def about():
    return send_from_directory(".", "about.html")

@site.route("/blog.html")
def blog():
    return send_from_directory(".", "blog.html")

@site.route("/contact.html")
def contact():
    return send_from_directory(".", "contact.html")

@site.route("/portfolio.html")
def portfolio():
    return send_from_directory(".", "portfolio.html")

@site.route('/assets/<path:filename>')
def assets(filename):
    # Serve files from /root/assets
    return send_from_directory(os.path.join(site.root_path, 'assets'), filename)

application = DispatcherMiddleware(site, {
    "/proj/iris": app1,
})

if __name__ == "__main__":
    run_simple("0.0.0.0", 5050, application, use_reloader=True, use_debugger=True)
