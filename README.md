# Basil Flora — Sales Lead CRM

A luxury real estate client enquiry form. Leads are stored in a SQLite database on the backend and can be exported as a styled Excel file on demand.

## Project Structure

```
basil-flora/
├── backend/
│   ├── app.py            ← Flask API server (SQLite + openpyxl export)
│   ├── requirements.txt
│   ├── Procfile          ← gunicorn entry point for Railway
│   └── leads.db          ← Auto-created on first run
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example      ← Copy to .env.local for local dev
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Local Development

### 1. Backend (Python / Flask)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
# → Running on http://localhost:5000
```

`leads.db` is created automatically on the first run.

### 2. Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:3000
```

Open **http://localhost:3000** in your browser. No `.env.local` file is needed for local development — the app falls back to `http://localhost:5000` automatically.

---

## Deploying the Backend to Railway

1. Push this repository to GitHub.
2. Go to [railway.app](https://railway.app) and create a **New Project → Deploy from GitHub repo**.
3. Select the repository and set the **Root Directory** to `backend`.
4. Railway auto-detects the `Procfile` and runs `gunicorn app:app`.
5. After deployment, copy the public URL Railway assigns (e.g. `https://basil-flora-production.up.railway.app`).

> `leads.db` is written to the Railway container's filesystem. For persistent storage across redeploys, attach a Railway **Volume** mounted at `/app` and ensure `DB_FILE` points there, or migrate to a managed database (e.g. Railway PostgreSQL).

---

## Deploying the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and create a **New Project → Import Git Repository**.
2. Select the repository and set the **Root Directory** to `frontend`.
3. Vercel auto-detects Vite; the default build settings work as-is:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Set the environment variable** before deploying:
   - Go to **Project Settings → Environment Variables**
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app` (the URL from the Railway step above — no trailing slash)
5. Click **Deploy**.

> Environment variables prefixed with `VITE_` are inlined at build time by Vite. After changing `VITE_API_URL` in Vercel settings you must trigger a new deployment for the change to take effect.

---

## API Endpoints

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| POST   | /api/submit   | Submit a new lead                    |
| GET    | /api/leads    | Return all leads as JSON             |
| GET    | /api/export   | Download all leads as an Excel file  |
| GET    | /health       | Health check                         |

### POST /api/submit — Payload

```json
{
  "clientName":     "Rahul Sharma",
  "requirement":    "2 BHK",
  "budget":         "65",
  "mobile":         "9876543210",
  "salesExecutive": "Executive 1"
}
```

### GET /api/export

Returns a downloadable `.xlsx` file with:
- Navy header row (bold white text, frozen)
- Alternating row colours for readability
- Auto-sized columns
