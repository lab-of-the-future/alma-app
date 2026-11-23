# ALMA website (Flask)

```
alma-app/
├── app.py              ← the app: routes, links, hackathon name
├── requirements.txt
├── templates/
│   ├── index.html      ← page content and text
│   └── partials/
│       └── logo-symbols.svg  ← the ALMA logo as vector shapes (used in nav, hero, footer)
└── static/
    ├── styles.css      ← styling (logo colours at the top)
    ├── script.js       ← full-screen logo intro + demo video autoplay
    ├── images/         ← favicon, logo SVGs, video poster frames, team photos
    └── videos/         ← logo.mp4 (intro) and the demo videos
```

## Run it on your computer

```bash
cd alma-app
python -m venv venv
# macOS/Linux:  source venv/bin/activate
# Windows:      venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000. The server restarts by itself when you save
`app.py`. If you change the HTML or CSS, refresh the browser to see it.

## Common changes

- **Links:** edit the `LINKS` dictionary at the top of `app.py`.
- **Hackathon name:** `HACKATHON_NAME` in `app.py`.
- **Text:** `templates/index.html`. Anything inside `{{ }}` is filled in by `app.py`.
- **Colours:** variables at the top of `static/styles.css` (teal `#36958F` and cream `#F6F4EB` come from the logo).
- **Logo intro:** plays once per browser session. To see it again, open the site with `?intro` at the end of the address.
- **Videos:** must be H.264 MP4s, or Chrome and Safari won't play them. To convert one:
  `ffmpeg -i input.mp4 -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart -an output.mp4`
- **New page or feature:** see the commented examples at the bottom of `app.py`.

## Deploy on PythonAnywhere

1. **Upload:** in the **Files** tab, upload `alma-app.zip` to your home folder.
   Open a **Bash** console (Consoles tab) and run:
   ```bash
   unzip alma-app.zip
   ```
   The app is now at `/home/<your-username>/alma-app/`.

2. **Create the web app:** **Web** tab → **Add a new web app** → Next →
   **Manual configuration** → pick a Python 3 version (e.g. 3.10).
   *(If you already set up the static-site version: delete the `/` static
   files entry first.)*

3. **Point it at app.py:** on the Web tab, click the **WSGI configuration
   file** link (`/var/www/<your-username>_pythonanywhere_com_wsgi.py`).
   Delete everything in it and paste:
   ```python
   import sys
   path = '/home/<your-username>/alma-app'
   if path not in sys.path:
       sys.path.insert(0, path)

   from app import app as application
   ```
   Replace `<your-username>`, then click **Save**.

4. **Serve static files fast** (optional, recommended): in the **Static
   files** section of the Web tab, add:
   - URL: `/static/`
   - Directory: `/home/<your-username>/alma-app/static`

5. Click the green **Reload** button. Your site is at
   `https://<your-username>.pythonanywhere.com`.

**Updating:** edit files in the Files tab (or upload new ones), then click
**Reload** on the Web tab. Python changes only take effect after a reload.

**If something breaks:** the **Error log** link on the Web tab shows the
Python error. If it says `No module named 'flask'`, open a Bash console
and run `python3.10 -m pip install --user flask`. Use the version number
you picked in step 2, then reload.

**Free plan:** the web app switches off after a month unless you log in
and click the button on the Web tab that extends it. You also have 512 MB
of disk in total, and videos count towards it.
