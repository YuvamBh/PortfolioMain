from io import BytesIO
import os
from flask import Flask, render_template, make_response, request
from uv_ai import uv_ai_bp
import functools
import gzip
from datetime import datetime
from flask import Response, request, jsonify
import requests

app = Flask(__name__,
            static_url_path='/static',
            static_folder='static')

# Register AI blueprint
app.register_blueprint(uv_ai_bp)

# Gzip compression decorator
def gzipped(f):
    @functools.wraps(f)
    def view_func(*args, **kwargs):
        response = make_response(f(*args, **kwargs))
        if 'gzip' not in request.headers.get('Accept-Encoding', ''):
            return response
        
        response.direct_passthrough = False
        if (response.status_code < 200 or response.status_code >= 300 or
                'Content-Encoding' in response.headers):
            return response
        
        gzip_buffer = BytesIO()
        gzip_file = gzip.GzipFile(mode='wb', fileobj=gzip_buffer)
        gzip_file.write(response.data)
        gzip_file.close()
        
        response.data = gzip_buffer.getvalue()
        response.headers['Content-Encoding'] = 'gzip'
        response.headers['Vary'] = 'Accept-Encoding'
        response.headers['Content-Length'] = len(response.data)
        
        return response
    return view_func

# Combined header function for SEO, caching, and security
@app.after_request
def add_headers(response):
    # SEO headers
    response.headers['X-Robots-Tag'] = 'index, follow'
    response.headers['Link'] = '<https://yuvambhargav.com>; rel="canonical"'
    
    # Cache control
    response.cache_control.public = True
    response.cache_control.max_age = 300
    
    # Security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    return response

# Sitemap route
@app.route('/sitemap.xml')
@gzipped
def sitemap():
    try:
        domain = "yuvambhargav.com"  # Your domain
        base_url = f"https://{domain}"
        
        # Get current timestamp
        current_time = datetime.now().strftime('%Y-%m-%d')
        
        # Create sitemap content with all your routes
        xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>{base_url}/</loc>
                <lastmod>{current_time}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>1.0</priority>
            </url>
            <url>
                <loc>{base_url}/projects</loc>
                <lastmod>{current_time}</lastmod>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>
        </urlset>
        """
        
        response = make_response(xml_content)
        response.headers["Content-Type"] = "application/xml"
        return response
        
    except Exception as e:
        app.logger.error(f"Sitemap generation error: {str(e)}")
        return "Error generating sitemap", 500

# Main routes
@app.route("/")
@gzipped
def index():
    return render_template("index.html")

@app.route("/projects")
@gzipped
def projects():
    return render_template("projects.html")

# --- GitHub contributions proxy ---
@app.route("/github/contributions")
def github_contributions():
    username = request.args.get("u", "YuvamBh")  # change default if you like
    url = f"https://github.com/users/{username}/contributions"
    try:
        r = requests.get(url, timeout=6, headers={"User-Agent": "Yuvam-Portfolio/1.0"})
        if r.status_code == 200 and r.text.strip():
            # cache for 1 hour; it's already near real-time
            return Response(r.text, mimetype="image/svg+xml",
                            headers={"Cache-Control": "public, max-age=3600"})
        return jsonify({"error": "Failed to fetch contributions", "status": r.status_code}), 502
    except requests.RequestException as e:
        return jsonify({"error": "Request to GitHub failed", "detail": str(e)}), 502


# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def server_error(e):
    return render_template('500.html'), 500

if __name__ == "__main__":
    print("Launching Flask..")
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=False)

