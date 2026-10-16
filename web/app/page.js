"use client";

import { useMemo, useState } from "react";

const leads = [
  { id: "NS-1048", name: "Maya Thompson", email: "maya.thompson@example.test", phone: "(202) 555-0148", vehicle: "2025 Toyota RAV4 Hybrid XSE", timeline: "This weekend", timelineDays: 4, leadType: "vehicle", budget: "$38,000–$42,000", trade: "2018 Honda CR-V", note: "Asked for the out-the-door price and wants to test drive Saturday morning.", source: "Website form", received: "2 min ago", initials: "MT", color: "lavender" },
  { id: "NS-1049", name: "Ethan Brooks", email: "ethan.brooks@example.test", phone: "(202) 555-0149", vehicle: "2024 Ford F-150 XLT", timeline: "Ready this week", timelineDays: 2, leadType: "vehicle", budget: "$45,000–$52,000", trade: "No trade-in", note: "Requested availability and financing options; can visit after work today.", source: "Website form", received: "4 min ago", initials: "EB", color: "blue" },
  { id: "NS-1050", name: "Sofia Ramirez", email: "sofia.ramirez@example.test", phone: "(202) 555-0150", vehicle: "2025 Honda CR-V Sport-L", timeline: "Within 2 weeks", timelineDays: 14, leadType: "vehicle", budget: "$35,000–$40,000", trade: "2020 Nissan Rogue", note: "Comparing two trims and asked for a trade-in appraisal appointment.", source: "Website form", received: "8 min ago", initials: "SR", color: "rose" },
  { id: "NS-1051", name: "Noah Williams", email: "noah.williams@example.test", phone: "(202) 555-0151", vehicle: "2025 Subaru Outback Premium", timeline: "Within 30 days", timelineDays: 30, leadType: "vehicle", budget: "$32,000–$36,000", trade: "2016 Subaru Forester", note: "Wants to compare monthly payments and has a vehicle to trade.", source: "Website form", received: "12 min ago", initials: "NW", color: "mint" },
  { id: "NS-1052", name: "Olivia Chen", email: "olivia.chen@example.test", phone: "(202) 555-0152", vehicle: "2025 Hyundai IONIQ 5", timeline: "Within 30 days", timelineDays: 28, leadType: "vehicle", budget: "$40,000–$48,000", trade: "2021 Kia Niro EV", note: "Asked about charging incentives and wants to arrange a test drive this month.", source: "Website form", received: "18 min ago", initials: "OC", color: "peach" },
  { id: "NS-1053", name: "Liam Patel", email: "liam.patel@example.test", phone: "(202) 555-0153", vehicle: "2025 Mazda CX-5 Carbon Edition", timeline: "In 3–4 weeks", timelineDays: 26, leadType: "vehicle", budget: "$30,000–$35,000", trade: "None", note: "Narrowing down SUVs and asked for a side-by-side feature sheet.", source: "Website form", received: "25 min ago", initials: "LP", color: "blue" },
  { id: "NS-1054", name: "Ava Johnson", email: "ava.johnson@example.test", phone: "(202) 555-0154", vehicle: "Used compact SUV", timeline: "In 2–3 months", timelineDays: 75, leadType: "vehicle", budget: "Around $22,000", trade: "2014 Toyota Corolla", note: "Starting research early and asked to hear about certified pre-owned options.", source: "Website form", received: "31 min ago", initials: "AJ", color: "lavender" },
  { id: "NS-1055", name: "Lucas Meyer", email: "lucas.meyer@example.test", phone: "(202) 555-0155", vehicle: "2025 Volkswagen Tiguan SE", timeline: "Lease ends in 5 months", timelineDays: 150, leadType: "vehicle", budget: "Not sure yet", trade: "Current VW lease", note: "Exploring lease-end choices and wants to understand buyout versus upgrade.", source: "Website form", received: "39 min ago", initials: "LM", color: "mint" },
  { id: "NS-1056", name: "Isabella Davis", email: "isabella.davis@example.test", phone: "(202) 555-0156", vehicle: "2025 Kia Telluride SX", timeline: "Just researching", timelineDays: 90, leadType: "vehicle", budget: "Not decided", trade: "None", note: "Asked for the brochure and is comparing family SUVs for a future purchase.", source: "Website form", received: "46 min ago", initials: "ID", color: "rose" },
  { id: "NS-1057", name: "James Wilson", email: "james.wilson@example.test", phone: "(202) 555-0157", vehicle: "Service appointment", timeline: "This week", timelineDays: null, leadType: "service", budget: "—", trade: "—", note: "Needs an oil change and tire rotation for a 2021 Camry.", source: "Website form", received: "52 min ago", initials: "JW", color: "peach" },
  { id: "NS-1058", name: "Grace Kim", email: "", phone: "", vehicle: "2025 Tesla Model Y", timeline: "ASAP", timelineDays: 1, leadType: "vehicle", budget: "$42,000–$48,000", trade: "2020 Tesla Model 3", note: "Requested a trade-in quote but did not provide contact information.", source: "Website form", received: "1 hr ago", initials: "GK", color: "blue" },
  { id: "NS-1059", name: "Benjamin Clark", email: "ben.clark@example.test", phone: "(202) 555-0159", vehicle: "Not specified", timeline: "Not specified", timelineDays: null, leadType: "vehicle", budget: "Not specified", trade: "Not specified", note: "Message: “Can you send me more info?” No vehicle or buying details included.", source: "Website form", received: "1 hr ago", initials: "BC", color: "lavender" },
];

const columns = [
  { id: "hot", title: "Hot", subtitle: "Contact within 5 min", icon: "↗", color: "hot" },
  { id: "active", title: "Active", subtitle: "Respond today", icon: "◷", color: "active" },
  { id: "nurture", title: "Nurture", subtitle: "Build the relationship", icon: "♡", color: "nurture" },
  { id: "needs_review", title: "Needs review", subtitle: "Check before routing", icon: "⌕", color: "review" },
];

function LeadCard({ lead }) {
  const pct = lead.confidence == null ? null : Math.round(lead.confidence * 100);
  return (
    <article className="lead-card">
      <div className="card-topline">
        <div className={`avatar ${lead.color}`}>{lead.initials}</div>
        <div className="lead-identity"><h3>{lead.name}</h3><span>{lead.id} · {lead.received}</span></div>
        <button className="more-button" aria-label={`More options for ${lead.name}`}>···</button>
      </div>
      <div className="vehicle-line"><span className="car-icon">▰</span><span>{lead.vehicle}</span></div>
      <p className="lead-note">{lead.note}</p>
      <div className="lead-facts">
        <div><span className="fact-label">TIMELINE</span><span className="fact-value">{lead.timeline}</span></div>
        <div><span className="fact-label">BUDGET</span><span className="fact-value">{lead.budget}</span></div>
      </div>
      {lead.trade !== "None" && lead.trade !== "—" && <div className="trade-line"><span>↔</span> Trade-in: {lead.trade}</div>}
      <div className="card-footer">
        <span className={`action-pill ${lead.action?.tone || ""}`}><span className="action-dot" />{lead.action?.title || "Action assigned"}</span>
        {pct != null && <span className="confidence" title={lead.guardrailApplied ? `Laya suggested ${lead.modelCategory}; ${lead.policyReason}` : `Laya confidence for ${lead.category}`}>{lead.guardrailApplied ? `Laya ${lead.modelCategory} · ${pct}%` : `${pct}% Laya`}</span>}
      </div>
      {lead.guardrailApplied && <div className="guardrail-note" title={lead.policyReason}>↳ Sales guardrail applied</div>}
      <div className="contact-row"><span>✉ {lead.email || "No email"}</span><span>☎ {lead.phone || "No phone"}</span></div>
    </article>
  );
}

export default function Home() {
  const [allLeads, setAllLeads] = useState(leads);
  const [classified, setClassified] = useState([]);
  const [busy, setBusy] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", vehicle: "", leadType: "vehicle", timeline: "within-7", budget: "", trade: "", note: "" });
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const groups = useMemo(() => Object.fromEntries(columns.map((c) => [c.id, classified.filter((l) => l.category === c.id)])), [classified]);
  const urgentCount = groups.hot?.length || 0;
  const avgConfidence = classified.length ? Math.round(classified.reduce((sum, lead) => sum + (lead.confidence || 0), 0) / classified.length * 100) : 0;

  async function classifyAll() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: allLeads }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not classify leads.");
      setClassified(data.leads);
      setFormSuccess("");
      setUpdatedAt(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()));
    } catch (err) {
      setError(err.message || "Laya could not be reached. Check that the Docker services are running.");
    } finally {
      setBusy(false);
    }
  }

  async function submitLead(event) {
    event.preventDefault();
    setSubmittingLead(true);
    setError("");
    setFormSuccess("");
    const timelineOptions = {
      "within-7": { label: "Within 7 days", days: 4 },
      "8-30": { label: "Within 8–30 days", days: 18 },
      "31-plus": { label: "More than 30 days", days: 90 },
      unknown: { label: "Not sure yet", days: null },
    };
    const timing = timelineOptions[leadForm.timeline];
    const name = leadForm.name.trim();
    const lead = {
      id: `WEB-${Date.now().toString().slice(-6)}`,
      name,
      email: leadForm.email.trim(),
      phone: leadForm.phone.trim(),
      vehicle: leadForm.vehicle.trim() || "Not specified",
      timeline: timing.label,
      timelineDays: timing.days,
      leadType: leadForm.leadType,
      budget: leadForm.budget.trim() || "Not specified",
      trade: leadForm.trade.trim() || "None",
      note: leadForm.note.trim() || "No additional details provided.",
      source: "Lead test form",
      received: "Just now",
      initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join(""),
      color: "blue",
    };

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: [lead] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not classify this lead.");
      const result = data.leads[0];
      setAllLeads((current) => [lead, ...current]);
      setClassified((current) => [result, ...current.filter((item) => item.id !== lead.id)]);
      setUpdatedAt(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()));
      setFormSuccess(`${lead.name} was classified as ${columns.find((column) => column.id === result.category)?.title}. ${result.action.title}.`);
      setLeadForm({ name: "", email: "", phone: "", vehicle: "", leadType: "vehicle", timeline: "within-7", budget: "", trade: "", note: "" });
      setFormOpen(false);
    } catch (err) {
      setError(err.message || "Laya could not be reached. Check that the Docker services are running.");
    } finally {
      setSubmittingLead(false);
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">N</div><div><strong>northstar</strong><span>MOTORS</span></div></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav">
          <a className="nav-item" href="#overview"><span className="nav-icon">▦</span>Overview</a>
          <a className="nav-item selected" href="#leads"><span className="nav-icon">♙</span>Lead desk<span className="nav-count">{allLeads.length}</span></a>
          <a className="nav-item" href="#leads"><span className="nav-icon">◷</span>Follow-ups</a>
          <a className="nav-item" href="#leads"><span className="nav-icon">▤</span>Inventory</a>
        </nav>
        <div className="sidebar-bottom"><div className="team-card"><div className="team-icon">✦</div><div><strong>Sales team</strong><span>Lead triage demo</span></div><span className="green-indicator" /></div><div className="profile"><div className="profile-avatar">AM</div><div><strong>Alex Morgan</strong><span>Sales manager</span></div><button aria-label="Profile options">⌄</button></div></div>
      </aside>

      <section className="main-area" id="overview">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Lead desk</strong></div><div className="top-actions"><div className="live-status"><span /> Laya is ready</div><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="mini-avatar">AM</div></div></header>
        <div className="content">
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> SALES OPERATIONS</div><h1>Lead desk</h1><p>Laya scores purchase readiness. Sales rules make every result actionable.</p></div><div className="heading-actions"><button className="secondary-button" onClick={() => { setFormOpen((open) => !open); setFormSuccess(""); }} disabled={busy || submittingLead}>＋ <span>Test a lead</span></button><button className="secondary-button" onClick={() => { setAllLeads(leads); setClassified([]); setError(""); setFormSuccess(""); setUpdatedAt(""); }} disabled={busy || submittingLead}>↻ <span>Reset demo</span></button><button className="primary-button" onClick={classifyAll} disabled={busy || submittingLead}>{busy ? <><span className="spinner" /> Classifying…</> : <><span>✦</span> Classify {allLeads.length} leads</>}</button></div></div>

          <div className="stats-row">
            <div className="stat-card"><div className="stat-label">NEW LEADS <span className="stat-glyph blue-glyph">♙</span></div><div className="stat-value">{allLeads.length}<span className="stat-sub">total leads</span></div><div className="stat-foot">Simulated leads and your test submissions</div></div>
            <div className="stat-card"><div className="stat-label">NEED A FAST RESPONSE <span className="stat-glyph coral-glyph">↗</span></div><div className="stat-value">{classified.length ? urgentCount : "—"}<span className="stat-sub">hot leads</span></div><div className="stat-foot">{classified.length ? "Prioritized for a quick call" : "Run classification to see"}</div></div>
            <div className="stat-card"><div className="stat-label">CLASSIFIED <span className="stat-glyph green-glyph-bg">✓</span></div><div className="stat-value">{classified.length || "—"}<span className="stat-sub">of {allLeads.length} leads</span></div><div className="stat-foot">{classified.length ? "All classified leads have a next step" : "Waiting for Laya"}</div></div>
            <div className="stat-card"><div className="stat-label">AVG. CONFIDENCE <span className="stat-glyph purple-glyph">✳</span></div><div className="stat-value">{classified.length ? `${avgConfidence}%` : "—"}</div><div className="stat-foot">{classified.length ? "Laya answer confidence" : "Across classifications"}</div></div>
          </div>

          <div className="board-toolbar" id="leads"><div className="board-title"><h2>Incoming leads</h2><span className="total-badge">{allLeads.length}</span><span className="board-caption">from the website form</span></div><div className="toolbar-actions"><button className="filter-button">☷ <span>Filters</span><b>0</b></button><button className="filter-button">⇅ <span>Sort: newest</span></button><div className="view-toggle"><button className="view-active" aria-label="Kanban view">▦</button><button aria-label="List view">☰</button></div></div></div>

          {error && <div className="error-banner"><span>!</span><div><strong>Classification didn’t finish</strong><p>{error}</p></div><button onClick={classifyAll}>Try again</button></div>}
          {busy && <div className="progress-banner"><span className="spinner dark-spinner" /> Laya is scoring purchase readiness while routing rules check timing, service requests, and contact details…</div>}
          {submittingLead && <div className="progress-banner"><span className="spinner dark-spinner" /> Sending your lead to Laya for classification…</div>}
          {formSuccess && <div className="success-banner"><span>✓</span> {formSuccess}</div>}
          {updatedAt && !busy && !formSuccess && <div className="success-banner"><span>✓</span> All {classified.length} leads scored by Laya and sorted with sales rules <span>·</span> Updated at {updatedAt}</div>}

          {formOpen && <section className="lead-form-panel" aria-labelledby="lead-form-title">
            <div className="lead-form-heading"><div><span className="eyebrow"><span className="eyebrow-line" /> LIVE CLASSIFICATION</span><h2 id="lead-form-title">Try your own lead</h2><p>Submit a lead to send it through Laya and add its result to the board.</p></div><button className="form-close" onClick={() => setFormOpen(false)} aria-label="Close lead form">×</button></div>
            <form onSubmit={submitLead}>
              <div className="lead-form-grid">
                <label>Customer name<input required maxLength={100} autoComplete="name" placeholder="e.g. Jordan Lee" value={leadForm.name} onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })} /></label>
                <label>Email <span>(optional)</span><input type="email" maxLength={160} autoComplete="email" placeholder="jordan@example.com" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} /></label>
                <label>Phone <span>(optional)</span><input type="tel" maxLength={40} autoComplete="tel" placeholder="(555) 555-0123" value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })} /></label>
                <label>Request type<select value={leadForm.leadType} onChange={(event) => setLeadForm({ ...leadForm, leadType: event.target.value })}><option value="vehicle">Vehicle purchase inquiry</option><option value="service">Service or parts request</option></select></label>
                <label>Vehicle of interest<input required maxLength={120} placeholder="e.g. 2025 Honda CR-V" value={leadForm.vehicle} onChange={(event) => setLeadForm({ ...leadForm, vehicle: event.target.value })} /></label>
                <label>Purchase timeline<select value={leadForm.timeline} onChange={(event) => setLeadForm({ ...leadForm, timeline: event.target.value })}><option value="within-7">Ready now / within 7 days</option><option value="8-30">Within 8–30 days</option><option value="31-plus">More than 30 days</option><option value="unknown">Not sure yet</option></select></label>
                <label>Budget <span>(optional)</span><input maxLength={80} placeholder="e.g. $35,000–$40,000" value={leadForm.budget} onChange={(event) => setLeadForm({ ...leadForm, budget: event.target.value })} /></label>
                <label>Trade-in <span>(optional)</span><input maxLength={100} placeholder="e.g. 2019 Toyota Camry" value={leadForm.trade} onChange={(event) => setLeadForm({ ...leadForm, trade: event.target.value })} /></label>
                <label className="form-wide">Lead details<textarea maxLength={1200} rows={3} placeholder="What did the customer ask about? Any preferred time to call?" value={leadForm.note} onChange={(event) => setLeadForm({ ...leadForm, note: event.target.value })} /></label>
              </div>
              <div className="form-footer"><span>Enter at least an email or phone for direct follow-up. Missing contact details route to Needs review.</span><div><button type="button" className="secondary-button" onClick={() => setFormOpen(false)} disabled={submittingLead}>Cancel</button><button type="submit" className="primary-button" disabled={submittingLead || busy}>{submittingLead ? <><span className="spinner" /> Sending…</> : <>✦ Classify with Laya</>}</button></div></div>
            </form>
          </section>}

          <div className="kanban-board">
            {columns.map((column) => {
              const cards = groups[column.id] || [];
              return <section className="kanban-column" key={column.id}>
                <div className={`column-heading ${column.color}`}><div className="column-icon">{column.icon}</div><h3>{column.title}</h3><span className="column-count">{cards.length}</span><button aria-label={`${column.title} options`}>···</button></div>
                <div className="column-subtitle">{column.subtitle}</div>
                <div className="card-stack">{cards.length ? cards.map((lead) => <LeadCard lead={lead} key={lead.id} />) : <div className="empty-column">{classified.length ? "No leads in this bucket" : busy ? "Reviewing leads…" : "Classify the sample leads to fill this column"}</div>}</div>
              </section>;
            })}
          </div>
          <footer className="page-footer"><span>✦</span> Laya readiness scores · Sales rules protect lead routing <i /> Demo data only · No real customer information</footer>
        </div>
      </section>
    </main>
  );
}
