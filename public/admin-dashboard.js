:root {
  --rose: #ef436a;
  --rose-soft: #fff0f4;
  --yellow: #f4d14d;
  --text: #1f2430;
  --muted: #758196;
  --line: #e8ebf2;
  --bg: #f7f8fc;
  --panel: #ffffff;
  --green: #1aa76f;
  --green-soft: #eaf9f2;
  --orange: #f29532;
  --orange-soft: #fff7e7;
  --red: #d85a6d;
  --red-soft: #fff0f3;
  --shadow: 0 18px 34px rgba(31, 36, 48, 0.08);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: var(--bg);
  color: var(--text);
}
button { font: inherit; }
.admin-shell {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}
.sidebar {
  background: #fff;
  border-right: 1px solid var(--line);
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
}
.brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 18px;
}
.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 3px solid #f4df16;
  background: var(--rose);
  color: white;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.5px;
}
.brand-copy {
  display: flex;
  flex-direction: column;
}
.brand-copy strong {
  font-size: 18px;
}
.brand-copy span {
  font-size: 8px;
  letter-spacing: 0.18em;
  color: var(--muted);
}
.nav {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}
.nav-item {
  background: transparent;
  border: 0;
  text-align: left;
  border-radius: 10px;
  height: 42px;
  padding: 0 12px;
  color: #59647b;
  font-weight: 700;
  cursor: pointer;
}
.nav-item.active {
  background: var(--rose-soft);
  color: var(--rose);
}
.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--line);
  padding-top: 16px;
}
.profile-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 8px;
  border-radius: 12px;
  background: #f9fafe;
}
.profile-pill span {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--rose), #ff8aa2);
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
}
.profile-pill strong,
.profile-pill small { display: block; }
.profile-pill small { color: var(--muted); font-size: 11px; }
.main-area {
  padding: 26px 28px 40px;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.crumb {
  margin: 0;
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.topbar h1 {
  margin: 8px 0 0;
  font-size: clamp(28px, 3vw, 38px);
  letter-spacing: -1px;
}
.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ghost-btn,
.danger-btn {
  border-radius: 10px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--line);
  background: white;
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
}
.danger-btn {
  background: #fff2f5;
  color: var(--rose);
  border-color: #ffd4dd;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.stat-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px 18px 16px;
  box-shadow: var(--shadow);
}
.stat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}
.badge {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.badge.pink { background: var(--rose-soft); color: var(--rose); }
.badge.yellow { background: #fff7e1; color: #c99600; }
.badge.green { background: var(--green-soft); color: var(--green); }
.badge.blue { background: #edf4ff; color: #4f78d8; }
.stat-card h2 {
  margin: 14px 0 8px;
  font-size: clamp(24px, 2.5vw, 34px);
  letter-spacing: -0.8px;
}
.stat-card small {
  font-size: 11px;
  font-weight: 700;
}
.up { color: var(--green); }
.warn { color: #d4971f; }
.content-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 16px;
}
.panel {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 18px 18px 16px;
  box-shadow: var(--shadow);
}
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.eyebrow {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 8px;
}
.panel-header h3 {
  margin: 0;
  font-size: 18px;
}
.pill {
  border-radius: 999px;
  background: #fff6da;
  color: #9a7318;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 10px;
}
.chart-bars {
  height: 180px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 18px;
  border-bottom: 1px solid var(--line);
}
.chart-bars span {
  flex: 1;
  min-height: 18px;
  display: flex;
  align-items: end;
  justify-content: center;
  border-radius: 10px 10px 0 0;
  background: linear-gradient(180deg, #f6aebd 0%, var(--rose) 100%);
  position: relative;
}
.chart-bars span em {
  position: absolute;
  top: -18px;
  font-style: normal;
  font-size: 10px;
  color: var(--muted);
}
.chart-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}
.commission-ring {
  width: 150px;
  height: 150px;
  margin: 8px auto 18px;
  border-radius: 50%;
  background: conic-gradient(var(--rose) 0 64%, #ffe1eb 64% 100%);
  display: grid;
  place-items: center;
}
.ring-inner {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: white;
  display: grid;
  place-items: center;
  text-align: center;
}
.ring-inner strong {
  display: block;
  font-size: 24px;
}
.ring-inner span {
  color: var(--muted);
  font-size: 11px;
}
.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 12px;
  padding: 7px 0;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}
.dot.rose { background: var(--rose); }
.dot.gray { background: #f0dce3; }
.table-panel {
  margin-top: 16px;
}
.table-head {
  margin-bottom: 8px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2px;
  font-size: 13px;
}
th, td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
}
th {
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.tag {
  display: inline-flex;
  padding: 6px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}
.tag.success {
  background: var(--green-soft);
  color: var(--green);
}
.tag.warning {
  background: var(--orange-soft);
  color: #b96610;
}
.tag.danger {
  background: var(--red-soft);
  color: var(--red);
}
@media (max-width: 980px) {
  .admin-shell { grid-template-columns: 1fr; }
  .sidebar { padding-bottom: 12px; }
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .content-grid { grid-template-columns: 1fr; }
}
@media (max-width: 620px) {
  .main-area { padding: 18px 14px 28px; }
  .topbar { flex-direction: column; align-items: flex-start; }
  .actions { width: 100%; }
  .actions button { flex: 1; }
  .stats-grid { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; }
}
