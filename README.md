# Basil Flora — Sales Lead CRM

A real estate client enquiry form that saves leads to an Excel file.

## Project Structure

```
basil-flora/
├── backend/
│   ├── app.py            ← Flask API server
│   ├── requirements.txt
│   └── leads.xlsx        ← Auto-created on first submission
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup & Run

### 1. Backend (Python / Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
# → Running on http://localhost:5000
```

### 2. Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
# → Running on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

## API Endpoints

| Method | Endpoint       | Description             |
|--------|----------------|-------------------------|
| POST   | /api/submit    | Submit a new lead       |
| GET    | /api/leads     | Fetch all saved leads   |
| GET    | /health        | Health check            |

## POST /api/submit — Payload

```json
{
  "clientName":     "Rahul Sharma",
  "requirement":    "2 BHK",
  "budget":         "65",
  "mobile":         "9876543210",
  "salesExecutive": "Executive 1"
}
```

## Excel Output (`leads.xlsx`)

Columns: S.No | Date & Time | Client Name | Requirement | Budget (Lakhs) | Mobile Number | Sales Executive

- Created automatically on the first submission.
- Alternating row colors for readability.
- Frozen header row.
