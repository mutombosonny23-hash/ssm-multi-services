:root {
  --rose: #ef436a;
  --rose-dark: #d72d5b;
  --yellow: #f5d84d;
  --cream: #fff8eb;
  --bg: #f4f6fb;
  --panel: #ffffff;
  --text: #202736;
  --muted: #7b8294;
  --line: #e8ebf2;
  --green: #1aa76f;
  --green-light: #edf8f2;
  --shadow: 0 18px 42px rgba(25, 31, 48, 0.08);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #fffaf7 0%, #f5f8ff 100%);
  font-family: 'Segoe UI', Tahoma, sans-serif;
  color: var(--text);
}
.page-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
}
.promo-panel {
  background: linear-gradient(180deg, rgba(239, 67, 106, 0.96), rgba(238, 131, 77, 0.88));
  color: white;
  padding: 42px 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.brand-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}
.brand-mark {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 4px solid #f4df16;
  background: #ef436a;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -1px;
}
.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}
.brand-copy strong {
  font-size: 28px;
  letter-spacing: -0.8px;
}
.brand-copy span {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
}
.eyebrow {
  font-size: 11px;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0.85;
  margin: 0 0 14px;
}
.promo-content h1 {
  margin: 0;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.02;
  letter-spacing: -1.5px;
  max-width: 540px;
}
.promo-content ul {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  display: grid;
  gap: 12px;
  font-size: 15px;
}
.promo-content li {
  position: relative;
  padding-left: 28px;
  opacity: 0.95;
}
.promo-content li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  color: #fffbe6;
  font-weight: 800;
}
.login-panel {
  display: grid;
  place-items: center;
  padding: 36px 22px;
}
.login-card {
  width: min(100%, 450px);
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: var(--shadow);
  padding: 24px 24px 20px;
}
.topbar-mini {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.mini-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 12px;
  background: #fff1f4;
  color: var(--rose);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.topbar-mini a {
  text-decoration: none;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}
.login-card h2 {
  margin: 0 0 6px;
  font-size: clamp(26px, 2vw, 36px);
  letter-spacing: -1px;
}
.login-card p {
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 14px;
}
.login-form {
  display: grid;
  gap: 16px;
}
.login-form label {
  display: grid;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  color: #313b4e;
}
.login-form input {
  width: 100%;
  height: 46px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0 14px;
  font-size: 15px;
  background: white;
  outline: none;
}
.login-form input:focus {
  border-color: rgba(239, 67, 106, 0.55);
  box-shadow: 0 0 0 3px rgba(239, 67, 106, 0.08);
}
.remember-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--muted);
}
.checkline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.checkline input {
  width: 15px;
  height: 15px;
  accent-color: var(--rose);
}
.remember-row a {
  color: var(--rose);
  text-decoration: none;
  font-weight: 700;
}
.primary-btn {
  border: 0;
  background: linear-gradient(135deg, var(--rose), #f05678);
  color: #fff;
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(239, 67, 106, 0.30);
}
.demo-credentials {
  margin-top: 18px;
  border: 1px dashed #f4d2dc;
  background: #fff8fa;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: var(--muted);
  font-size: 12px;
}
.demo-credentials strong {
  color: var(--text);
  font-size: 12px;
}
@media (max-width: 960px) {
  .page-shell { grid-template-columns: 1fr; }
  .promo-panel { padding-bottom: 20px; }
}
