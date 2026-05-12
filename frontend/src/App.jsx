import { useState } from "react";

const REQUIREMENTS = ["2 BHK", "3 BHK", "Office", "Shop"];
const EXECUTIVES = ["Executive 1", "Executive 2", "Executive 3"];

const initialForm = {
  clientName: "",
  requirement: "",
  budget: "",
  mobile: "",
  salesExecutive: "",
};

function InputField({ label, id, children, icon }) {
  return (
    <div className="field-group">
      <label htmlFor={id} className="field-label">
        <span className="label-icon">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: "success", message: "✓ Lead submitted successfully! Data saved to Excel." });
        setForm(initialForm);
      } else {
        setStatus({ type: "error", message: data.message || "Submission failed." });
      }
    } catch {
      setStatus({ type: "error", message: "Could not connect to server. Ensure the backend is running on port 5000." });
    } finally {
      setLoading(false);
    }
  };

  const allFilled = Object.values(form).every((v) => v.trim() !== "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97E;
          --navy: #0E1E35;
          --navy-mid: #1A3C5E;
          --cream: #FAF7F2;
          --text-dark: #1A1A1A;
          --text-mid: #4A4A4A;
          --text-light: #8A8A8A;
          --border: #D8CDB8;
          --shadow: 0 24px 64px rgba(14,30,53,0.14);
        }

        body {
          font-family: 'Jost', sans-serif;
          background-color: var(--navy);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(201,168,76,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 90%, rgba(26,60,94,0.6) 0%, transparent 60%);
        }

        .page-wrapper {
          width: 100%;
          max-width: 560px;
        }

        /* ── Brand Header ── */
        .brand-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .brand-emblem {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px; height: 72px;
          border: 2px solid var(--gold);
          border-radius: 50%;
          margin-bottom: 16px;
          position: relative;
        }
        .brand-emblem svg {
          width: 36px; height: 36px;
        }
        .brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6rem;
          font-weight: 600;
          color: var(--cream);
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .brand-tagline {
          font-size: 0.75rem;
          font-weight: 300;
          color: var(--gold);
          letter-spacing: 0.32em;
          text-transform: uppercase;
          margin-top: 6px;
        }
        .brand-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          justify-content: center;
        }
        .brand-divider span {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold));
        }
        .brand-divider span:last-child {
          background: linear-gradient(90deg, var(--gold), transparent);
        }
        .brand-divider em {
          width: 6px; height: 6px;
          background: var(--gold);
          transform: rotate(45deg);
          display: block;
        }

        /* ── Card ── */
        .card {
          background: var(--cream);
          border-radius: 4px;
          padding: 44px 44px 40px;
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--navy-mid), var(--gold), var(--navy-mid));
        }

        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--navy);
          letter-spacing: 0.02em;
          margin-bottom: 4px;
        }
        .card-subtitle {
          font-size: 0.78rem;
          font-weight: 400;
          color: var(--text-light);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 32px;
        }

        /* ── Fields ── */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 24px;
        }
        .field-full { grid-column: 1 / -1; }

        .field-group { display: flex; flex-direction: column; gap: 7px; }

        .field-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-mid);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .label-icon { color: var(--gold); font-style: normal; font-size: 1rem; line-height: 1; }

        input, select {
          font-family: 'Jost', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: var(--text-dark);
          background: #FFFFFF;
          border: 1.5px solid var(--border);
          border-radius: 2px;
          padding: 11px 14px;
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          outline: none;
        }
        input:focus, select:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        input::placeholder { color: #B8B0A2; }
        select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A84C' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        select option[value=""] { color: #B8B0A2; }

        .budget-wrapper { position: relative; }
        .budget-wrapper input { padding-left: 50px; }
        .budget-unit {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 44px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--cream);
          background: var(--navy-mid);
          border-radius: 2px 0 0 2px;
          pointer-events: none;
        }

        /* ── Submit ── */
        .submit-btn {
          width: 100%;
          margin-top: 30px;
          padding: 14px;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
          color: var(--gold-light);
          border: 1.5px solid var(--gold);
          border-radius: 2px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
          color: var(--navy);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ── Status ── */
        .status-msg {
          margin-top: 18px;
          padding: 12px 16px;
          border-radius: 2px;
          font-size: 0.85rem;
          font-weight: 500;
          text-align: center;
        }
        .status-success {
          background: #EDF7F0;
          color: #276749;
          border: 1px solid #9FD3B0;
        }
        .status-error {
          background: #FDF1F1;
          color: #8B2020;
          border: 1px solid #F0AAAA;
        }

        /* ── Footer ── */
        .card-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.72rem;
          color: var(--text-light);
          letter-spacing: 0.06em;
        }
        .footer-dot { width: 3px; height: 3px; background: var(--gold); border-radius: 50%; }

        @media (max-width: 520px) {
          .card { padding: 32px 24px 28px; }
          .form-grid { grid-template-columns: 1fr; }
          .field-full { grid-column: 1; }
          .brand-name { font-size: 2rem; }
        }
      `}</style>

      <div className="page-wrapper">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-emblem">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 4L4 14V32H13V22H23V32H32V14L18 4Z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
              <path d="M14 32V24H22V32" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="brand-name">Basil Flora</div>
          <div className="brand-tagline">Premium Real Estate</div>
          <div className="brand-divider">
            <span /><em /><span />
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          <div className="card-title">New Client Enquiry</div>
          <div className="card-subtitle">Sales Lead Registration</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">

              <div className="field-full">
                <InputField label="Client Name" id="clientName" icon="👤">
                  <input
                    id="clientName" name="clientName" type="text"
                    placeholder="Full name of the client"
                    value={form.clientName} onChange={handleChange} required
                  />
                </InputField>
              </div>

              <InputField label="Requirement" id="requirement" icon="🏠">
                <select id="requirement" name="requirement" value={form.requirement} onChange={handleChange} required>
                  <option value="">Select type</option>
                  {REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </InputField>

              <InputField label="Budget" id="budget" icon="₹">
                <div className="budget-wrapper">
                  <div className="budget-unit">LAKH</div>
                  <input
                    id="budget" name="budget" type="number"
                    placeholder="e.g. 45"
                    min="1" step="0.5"
                    value={form.budget} onChange={handleChange} required
                  />
                </div>
              </InputField>

              <InputField label="Mobile Number" id="mobile" icon="📱">
                <input
                  id="mobile" name="mobile" type="tel"
                  placeholder="10-digit mobile"
                  maxLength={10}
                  value={form.mobile} onChange={handleChange} required
                />
              </InputField>

              <div className="field-full">
                <InputField label="Sales Executive" id="salesExecutive" icon="👔">
                  <select id="salesExecutive" name="salesExecutive" value={form.salesExecutive} onChange={handleChange} required>
                    <option value="">Assign executive</option>
                    {EXECUTIVES.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </InputField>
              </div>

            </div>

            <button type="submit" className="submit-btn" disabled={loading || !allFilled}>
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Saving…
                </>
              ) : (
                <>
                  <span>⊕</span> Register Lead
                </>
              )}
            </button>

            {status && (
              <div className={`status-msg ${status.type === "success" ? "status-success" : "status-error"}`}>
                {status.message}
              </div>
            )}
          </form>

          <div className="card-footer">
            <span>Basil Flora</span>
            <span className="footer-dot" />
            <span>Sales CRM</span>
            <span className="footer-dot" />
            <span>Confidential</span>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
