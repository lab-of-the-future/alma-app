"""
ALMA website – a small Flask app.

Run locally:   python app.py   (then open http://127.0.0.1:5000)
Page content:  templates/index.html
Styles/JS:     static/styles.css, static/script.js
Videos/images: static/videos/, static/images/
"""
from flask import Flask, render_template

app = Flask(__name__)


# ---------------------------------------------------------------
# Edit your links here. They are used all over the page, so you
# only change each one in one place. Leave "#" until you have it.
# ---------------------------------------------------------------
LINKS = {
    # "Learn more about ALMA" cards
    "write_up": "#",         # Devpost / hackathon submission page
    "source_code": "https://github.com/lab-of-the-future/alma-app",  # GitHub repository
    "pitch_deck": "#",       # Slides
    "demo_video": "#",       # Full demo on YouTube / Vimeo

    # "Learn more" links under each feature
    "reports": "#",
    "mistakes": "#",
    "object_tracking": "#",
    "pipetting": "#",

    # Survey for wet-lab researchers (hero button + survey panel)
    "survey": "https://form.jotform.com/262716592147059",

    # Team LinkedIn profiles
    "linkedin_andrea": "https://www.linkedin.com/in/andrea-rico-montana/",
    "linkedin_charlie": "https://www.linkedin.com/in/charrayner/",
}

HACKATHON_NAME = "Lab-of-the-Future Hackathon"


@app.route("/")
def home():
    return render_template("index.html", links=LINKS, hackathon=HACKATHON_NAME)


# ---------------------------------------------------------------
# Adding a new page later:
#   1. Create templates/<name>.html
#   2. Add a route like this one:
#
# @app.route("/about")
# def about():
#     return render_template("about.html", links=LINKS, hackathon=HACKATHON_NAME)
#
# Adding an API endpoint for a live feature, e.g. data for the page:
#
# from flask import jsonify
# @app.route("/api/status")
# def status():
#     return jsonify({"ok": True})
# ---------------------------------------------------------------


if __name__ == "__main__":
    # debug=True reloads the server whenever you save a file
    app.run(debug=True)