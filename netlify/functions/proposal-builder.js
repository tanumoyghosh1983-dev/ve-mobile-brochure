const { CATEGORIES } = require("./categories-extract.js");
const { PACKAGE_TIERS } = require("./packages-extract.js");
const { CASE_STUDIES, ABOUT_VE } = require("./demo-content.js");

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function fmtMoney(n) {
  return "$" + Math.round(n).toLocaleString();
}

function tierFromTotal(total) {
  if (total > 0 && total < 1200) return "startup";
  if (total < 4500) return "growth";
  return "enterprise";
}

function pickPackage(tier, extrasCount) {
  const allPackages = PACKAGE_TIERS[tier] || PACKAGE_TIERS.startup;
  // Filter out packages that don't represent "build this app from scratch" —
  // things like app rescue/audit, ongoing maintenance-only, post-completion
  // launch support, or discovery-only engagements are real packages but the
  // wrong match for a from-zero build proposal like this one generates.
  const EXCLUDE_PATTERNS = /rescue|audit|maintenance|support(?!\s+for)|launch and go-live|discovery and (architecture|prototype)/i;
  const packages = allPackages.filter(p => !EXCLUDE_PATTERNS.test(p.name));
  const usable = packages.length > 0 ? packages : allPackages;
  const idx = Math.min(
    usable.length - 1,
    Math.floor((extrasCount / 12) * usable.length)
  );
  return usable[Math.max(0, idx)];
}

function timelineFromTotal(total) {
  if (total < 1200) return "1-4 weeks";
  if (total < 4500) return "5-10 weeks";
  return "10-20+ weeks";
}

function buildProposalHTML(input) {
  const platform = Array.isArray(input.platform) ? input.platform : [];
  const size = input.size || null;
  const categoryKey = input.category || "custom";
  const selectedLabels = Array.isArray(input.selectedLabels) ? input.selectedLabels : [];
  const extrasCount = input.extrasCount || selectedLabels.length;
  const total = typeof input.total === "number" ? input.total : 0;
  const clientName = input.clientName || "Your Company";
  const projectDescription = input.projectDescription || "";

  const category = CATEGORIES[categoryKey] || CATEGORIES.custom;
  const tier = tierFromTotal(total);
  const pkg = pickPackage(tier, extrasCount);
  const caseStudy = CASE_STUDIES[categoryKey] || CASE_STUDIES.custom;
  const timeline = timelineFromTotal(total);

  const platformLabel = platform.length === 2
    ? "iOS and Android"
    : platform.includes("ios") ? "iOS"
    : platform.includes("android") ? "Android"
    : "your chosen platform";

  const sizeLabel = { mvp: "an MVP-scope app", basic: "a basic-scope app", refined: "a fully refined, polished app" }[size] || "your app";

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const proposalId = "VE-" + Date.now().toString(36).toUpperCase();

  const coverPage = "<section class=\"page cover-page\">" +
    "<div class=\"cover-top\"><div class=\"brand-mark\">Virtual<span>Employee</span></div>" +
    "<div class=\"proposal-id\">Proposal #" + escapeHtml(proposalId) + "</div></div>" +
    "<div class=\"cover-mid\"><div class=\"eyebrow\">Project Proposal</div>" +
    "<h1>" + escapeHtml(category.label) + " App Development</h1>" +
    (clientName && clientName !== "Your Company" ? "<p class=\"cover-sub\">Prepared for " + escapeHtml(clientName) + "</p>" : "") + "</div>" +
    "<div class=\"cover-bottom\">" +
    "<div class=\"cover-meta\"><span>Prepared by</span><strong>VirtualEmployee.com</strong></div>" +
    "<div class=\"cover-meta\"><span>Date</span><strong>" + escapeHtml(today) + "</strong></div>" +
    "</div></section>";

  const execSummaryPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">01 - Executive Summary</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>What we understood, and what we recommend</h2>" +
    "<p class=\"lead\">You're looking to build " + escapeHtml(sizeLabel) + " in the <strong>" + escapeHtml(category.label) + "</strong> space, for " + escapeHtml(platformLabel) + ". " +
    (projectDescription ? escapeHtml(projectDescription) : "") + "</p>" +
    "<div class=\"callout\">" +
    "<div class=\"callout-row\"><span>Recommended package tier</span><strong>" + escapeHtml(tier.charAt(0).toUpperCase() + tier.slice(1)) + "</strong></div>" +
    "<div class=\"callout-row\"><span>Estimated investment</span><strong>" + fmtMoney(total) + "</strong></div>" +
    "<div class=\"callout-row\"><span>Estimated timeline</span><strong>" + escapeHtml(timeline) + "</strong></div>" +
    "</div>" +
    "<p>This proposal walks through exactly what's included, what's not, a relevant project we've delivered in this space, our recommended approach, and clear next steps to get started.</p>" +
    "</section>";

  const aboutPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">02 - About VirtualEmployee</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>Who you'd be working with</h2>" +
    "<p class=\"lead\">" + escapeHtml(ABOUT_VE.intro) + "</p>" +
    "<div class=\"stat-row\">" + ABOUT_VE.stats.map(function(s){ return "<div class=\"stat-box\"><div class=\"stat-value\">" + escapeHtml(s.value) + "</div><div class=\"stat-label\">" + escapeHtml(s.label) + "</div></div>"; }).join("") + "</div>" +
    "<ul class=\"check-list\">" + ABOUT_VE.points.map(function(p){ return "<li>" + escapeHtml(p) + "</li>"; }).join("") + "</ul>" +
    "</section>";

  const requirementsPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">03 - Understanding Your Requirements</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>Here's what you told us</h2>" +
    "<table class=\"req-table\">" +
    "<tr><td>Platform</td><td>" + escapeHtml(platformLabel) + "</td></tr>" +
    "<tr><td>App size</td><td>" + escapeHtml(sizeLabel) + "</td></tr>" +
    "<tr><td>App category</td><td>" + escapeHtml(category.label) + "</td></tr>" +
    "<tr><td>Selected features</td><td>" + (selectedLabels.length ? selectedLabels.map(escapeHtml).join(", ") : "Core features only, no add-ons selected") + "</td></tr>" +
    "</table>" +
    "<p class=\"note\">If anything here doesn't reflect your intent, no problem - this proposal is a strong starting point, not a final locked-in scope. We'll refine it together before any work begins.</p>" +
    "</section>";

  const catFeatures = category.features.map(function(f){ return f[0]; });
  const catAI = category.ai.map(function(a){ return a[0]; });
  const featuresPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">04 - Recommended Solution</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>What we'd build for a " + escapeHtml(category.label) + " app</h2>" +
    "<p class=\"lead\">Based on similar projects in this category, here's the feature set we'd typically recommend, alongside AI capabilities that fit this kind of app well.</p>" +
    "<div class=\"two-col\">" +
    "<div class=\"col-card\"><h3>Core features</h3><ul class=\"check-list\">" + catFeatures.map(function(f){ return "<li>" + escapeHtml(f) + "</li>"; }).join("") + "</ul></div>" +
    "<div class=\"col-card\"><h3>AI opportunities</h3><ul class=\"check-list\">" + catAI.map(function(f){ return "<li>" + escapeHtml(f) + "</li>"; }).join("") + "</ul></div>" +
    "</div></section>";

  const includedPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">05 - Scope of Work</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>" + escapeHtml(pkg.name) + "</h2>" +
    "<p class=\"lead\">" + escapeHtml(pkg.best) + "</p>" +
    "<div class=\"two-col\">" +
    "<div class=\"col-card\"><h3 class=\"included-h\">Included</h3><ul class=\"check-list included\">" + pkg.included.map(function(i){ return "<li>" + escapeHtml(i) + "</li>"; }).join("") + "</ul></div>" +
    "<div class=\"col-card\"><h3 class=\"excluded-h\">Not included</h3><ul class=\"check-list excluded\">" + (pkg.not || []).map(function(i){ return "<li>" + escapeHtml(i) + "</li>"; }).join("") + "</ul></div>" +
    "</div>" +
    "<p class=\"note\">Anything listed as \"not included\" can be scoped separately if your project needs it - we'll flag this during our kickoff call.</p>" +
    "</section>";

  const caseStudyPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">06 - Relevant Experience</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>" + escapeHtml(caseStudy.title) + "</h2>" +
    "<p class=\"case-client\">" + escapeHtml(caseStudy.client) + "</p>" +
    "<p class=\"lead\">" + escapeHtml(caseStudy.summary) + "</p>" +
    "<div class=\"callout\">" +
    "<div class=\"callout-row\"><span>Tech stack</span><strong>" + escapeHtml(caseStudy.stack) + "</strong></div>" +
    "<div class=\"callout-row\"><span>Outcome</span><strong>" + escapeHtml(caseStudy.outcome) + "</strong></div>" +
    "</div></section>";

  const milestones = [
    { phase: "Discovery & Planning", weeks: "Week 1", detail: "Requirements finalization, technical architecture, and design kickoff." },
    { phase: "Design", weeks: tier === "startup" ? "Week 1-2" : "Week 2-3", detail: "UI/UX design for all core screens, reviewed and approved with you." },
    { phase: "Development - Core Build", weeks: tier === "startup" ? "Week 2-3" : tier === "growth" ? "Week 3-7" : "Week 3-14", detail: "Core features built and integrated, with regular progress check-ins." },
    { phase: "QA & Testing", weeks: "Final week", detail: "Functional testing, bug fixes, and performance checks before launch." },
    { phase: "Launch & Handoff", weeks: "Launch week", detail: "App store submission support (if applicable) and project handoff." },
  ];
  const timelinePage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">07 - Project Timeline</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>How we'd get there - " + escapeHtml(timeline) + "</h2>" +
    "<div class=\"timeline\">" +
    milestones.map(function(m, i){
      return "<div class=\"timeline-row\"><div class=\"timeline-num\">" + (i+1) + "</div>" +
        "<div class=\"timeline-body\"><div class=\"timeline-head\"><strong>" + escapeHtml(m.phase) + "</strong><span>" + escapeHtml(m.weeks) + "</span></div>" +
        "<p>" + escapeHtml(m.detail) + "</p></div></div>";
    }).join("") +
    "</div></section>";

  const pricingPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">08 - Investment</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>Estimated cost breakdown</h2>" +
    "<table class=\"price-table\">" +
    "<tr><td>Base package (" + escapeHtml(pkg.name) + ")</td><td>" + escapeHtml(pkg.price) + "</td></tr>" +
    "<tr><td>Category-specific features (" + escapeHtml(category.label) + ")</td><td>" + fmtMoney(category.add) + "</td></tr>" +
    "<tr><td>Additional selected features (" + extrasCount + ")</td><td>" + fmtMoney(input.extras || 0) + "</td></tr>" +
    "<tr class=\"price-total\"><td>Estimated total</td><td>" + fmtMoney(total) + "</td></tr>" +
    "</table>" +
    "<p class=\"note\">This is a starting estimate based on the information provided. Final pricing is confirmed after a short scoping call to validate requirements.</p>" +
    "</section>";

  const risksPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">09 - Risks & Our Approach</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>How we manage project risk</h2>" +
    "<table class=\"req-table\">" +
    "<tr><td>Scope creep</td><td>Milestone-based delivery with clear sign-off at each stage keeps scope changes visible and manageable.</td></tr>" +
    "<tr><td>Timeline delays</td><td>Weekly progress check-ins surface blockers early, before they affect the delivery date.</td></tr>" +
    "<tr><td>Communication gaps</td><td>A dedicated point of contact and shared project tracker keep everyone aligned in real time.</td></tr>" +
    "<tr><td>Post-launch issues</td><td>Our warranty period (next page) covers post-launch fixes at no additional cost.</td></tr>" +
    "</table></section>";

  const warrantyPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">10 - Warranty & Support</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>What happens after launch</h2>" +
    "<p class=\"lead\">We stand behind our work with a 30-day warranty from the date of launch. During this period, we'll address any software malfunctions or issues at no additional cost.</p>" +
    "<p class=\"lead\">Beyond the warranty period, we offer ongoing maintenance and support plans to keep your app running smoothly, handle platform updates, and support future feature development.</p>" +
    "<p class=\"note\">We also provide a walkthrough session for your team, covering how to manage day-to-day operations of the app (admin panel usage, content updates, and common troubleshooting steps).</p>" +
    "</section>";

  const nextStepsPage = "<section class=\"page\"><div class=\"page-header\"><div class=\"page-eyebrow\">11 - Next Steps</div><div class=\"page-brand\">Virtual<span>Employee</span></div></div>" +
    "<h2>Ready to move forward?</h2>" +
    "<ol class=\"steps-list\">" +
    "<li><strong>Review this proposal</strong> - take your time, share it with your team.</li>" +
    "<li><strong>Book a scoping call</strong> - a short call to confirm requirements and answer questions.</li>" +
    "<li><strong>Confirm and kick off</strong> - once aligned, we begin discovery and design within days.</li>" +
    "</ol>" +
    "<div class=\"cta-box\"><strong>Questions about this proposal?</strong><p>Reach out any time - we're happy to walk through any part of this in more detail.</p></div>" +
    "</section>";

  const closingPage = "<section class=\"page closing-page\">" +
    "<div class=\"brand-mark\">Virtual<span>Employee</span></div>" +
    "<h2>Thank you</h2>" +
    "<p class=\"lead\">This proposal is valid for 30 days from the date above. Pricing and timeline are estimates based on the information provided and are subject to a final scoping conversation.</p>" +
    "<p class=\"note\">VirtualEmployee.com &nbsp;&middot;&nbsp; Proposal #" + escapeHtml(proposalId) + " &nbsp;&middot;&nbsp; " + escapeHtml(today) + "</p>" +
    "</section>";

  const allPages = [
    coverPage, execSummaryPage, aboutPage, requirementsPage,
    featuresPage, includedPage, caseStudyPage, timelinePage,
    pricingPage, risksPage, warrantyPage, nextStepsPage, closingPage,
  ].join("\n");

  return wrapDocument(allPages);
}

function wrapDocument(bodyHTML) {
  const css = "@page{size:A4;margin:0;}*{box-sizing:border-box;margin:0;padding:0;}" +
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');" +
  ":root{--bg:#F4F2EB;--tile:#FFFFFF;--ink:#17130B;--body:#4B463B;--muted:#6E675A;--faint:#9B937F;" +
  "--line:rgba(23,19,11,.12);--coral:#FF5A36;--butter:#FFD649;--mint:#B9EFD9;--mint-deep:#0E8A66;--teal:#0EA5A4;" +
  "--shadow:0 1px 2px rgba(23,19,11,.03), 0 12px 32px -20px rgba(23,19,11,.18);}" +
  "body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;}" +
  ".page{width:210mm;padding:20mm 18mm;page-break-after:always;page-break-inside:avoid;position:relative;background:var(--bg);" +
  "background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%224%22%20height%3D%224%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%220.6%22%20fill%3D%22rgba%2823%2C19%2C11%2C0.35%29%22/%3E%3C/svg%3E');background-size:4px 4px;}" +
  ".page:last-child{page-break-after:auto;}" +
  ".page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;padding-bottom:14px;border-bottom:1px solid var(--line);}" +
  ".page-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--coral);display:flex;align-items:center;gap:8px;}" +
  ".page-eyebrow::before{content:'';width:18px;height:2px;background:var(--coral);display:inline-block;}" +
  ".page-brand{font-size:12px;font-weight:800;letter-spacing:-.01em;color:var(--faint);}" +
  ".page-brand span{color:var(--coral);}" +
  "h1{font-size:34px;font-weight:800;letter-spacing:-0.03em;line-height:1.08;margin-bottom:10px;}" +
  "h2{font-size:25px;font-weight:800;letter-spacing:-0.02em;line-height:1.15;margin-bottom:16px;color:var(--ink);}" +
  "h3{font-size:14px;font-weight:800;letter-spacing:-.01em;margin-bottom:12px;}" +
  "p.lead{font-size:13.5px;line-height:1.65;color:var(--body);margin-bottom:16px;}" +
  "p.note{font-size:11.5px;line-height:1.55;color:var(--faint);margin-top:14px;}" +
  ".brand-mark{font-family:'Inter',sans-serif;font-size:19px;font-weight:800;letter-spacing:-0.02em;}" +
  ".brand-mark span{color:var(--coral);}" +
  /* cover */
  ".cover-page{background:var(--ink);background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%224%22%20height%3D%224%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%220.6%22%20fill%3D%22rgba%28244%2C242%2C235%2C0.25%29%22/%3E%3C/svg%3E');background-size:4px 4px;color:var(--bg);display:flex;flex-direction:column;justify-content:space-between;}" +
  ".cover-page .brand-mark{color:var(--bg);}.cover-page .brand-mark span{color:var(--butter);}" +
  ".cover-top{display:flex;justify-content:space-between;align-items:center;}" +
  ".proposal-id{font-size:11px;color:rgba(244,242,235,0.45);font-weight:600;}" +
  ".cover-mid{margin-top:auto;margin-bottom:auto;}" +
  ".cover-mid .eyebrow{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--butter);margin-bottom:18px;display:flex;align-items:center;gap:8px;}" +
  ".cover-mid .eyebrow::before{content:'';width:22px;height:2px;background:var(--butter);display:inline-block;}" +
  ".cover-mid h1{font-size:46px;color:var(--bg);max-width:130mm;}" +
  ".cover-sub{font-size:16px;color:rgba(244,242,235,0.68);}" +
  ".cover-bottom{display:flex;gap:44px;border-top:1px solid rgba(244,242,235,0.18);padding-top:18px;}" +
  ".cover-meta{display:flex;flex-direction:column;gap:4px;}" +
  ".cover-meta span{font-size:10px;text-transform:uppercase;letter-spacing:0.06em;color:rgba(244,242,235,0.45);font-weight:700;}" +
  ".cover-meta strong{font-size:13.5px;font-weight:700;}" +
  /* closing */
  ".closing-page{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:18px;}" +
  ".closing-page h2{font-size:30px;}" +
  /* callouts (tile cards, matching brochure --shadow) */
  ".callout{background:var(--tile);border:1px solid var(--line);border-radius:20px;padding:20px 22px;margin-bottom:20px;box-shadow:var(--shadow);}" +
  ".callout-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;font-size:13px;border-bottom:1px solid var(--line);}" +
  ".callout-row:last-child{border-bottom:none;}.callout-row span{color:var(--muted);font-weight:500;}.callout-row strong{font-weight:800;}" +
  /* tables */
  "table{width:100%;border-collapse:collapse;margin-bottom:12px;}" +
  ".req-table td,.price-table td{padding:12px 0;font-size:13px;border-bottom:1px solid var(--line);vertical-align:top;}" +
  ".req-table td:first-child{font-weight:700;width:32%;color:var(--ink);}" +
  ".req-table td:last-child{color:var(--body);}" +
  ".price-table td:last-child{text-align:right;font-weight:700;}" +
  ".price-total td{font-size:16px;font-weight:800;border-top:2px solid var(--ink);border-bottom:none;padding-top:14px;color:var(--ink);}" +
  /* lists */
  ".check-list{list-style:none;}" +
  ".check-list li{font-size:13px;padding:7px 0 7px 24px;position:relative;color:var(--body);line-height:1.4;}" +
  ".check-list li::before{content:'\\2713';position:absolute;left:0;top:7px;color:var(--mint-deep);font-weight:800;}" +
  ".check-list.excluded li::before{content:'\\2014';color:var(--coral);}" +
  ".included-h{color:var(--mint-deep);}" +
  ".excluded-h{color:var(--coral);}" +
  ".two-col{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:18px;}" +
  ".col-card{background:var(--tile);border:1px solid var(--line);border-radius:18px;padding:18px 20px;box-shadow:var(--shadow);}" +
  /* stat row */
  ".stat-row{display:flex;gap:14px;margin-bottom:22px;}" +
  ".stat-box{flex:1;background:var(--tile);border:1px solid var(--line);border-radius:16px;padding:18px;text-align:center;box-shadow:var(--shadow);}" +
  ".stat-value{font-size:26px;font-weight:800;color:var(--ink);letter-spacing:-.02em;}" +
  ".stat-label{font-size:11px;color:var(--muted);margin-top:4px;font-weight:600;}" +
  ".case-client{font-size:12.5px;color:var(--muted);margin-bottom:14px;font-weight:600;}" +
  /* timeline */
  ".timeline-row{display:flex;gap:16px;margin-bottom:18px;}" +
  ".timeline-num{width:28px;height:28px;border-radius:9px;background:var(--ink);color:var(--butter);font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}" +
  ".timeline-head{display:flex;justify-content:space-between;font-size:14px;margin-bottom:5px;}" +
  ".timeline-head strong{color:var(--ink);}" +
  ".timeline-head span{color:var(--faint);font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;}" +
  ".timeline-body p{font-size:12.5px;color:var(--body);line-height:1.5;}" +
  ".steps-list{padding-left:20px;margin-bottom:20px;}" +
  ".steps-list li{font-size:14px;line-height:1.65;margin-bottom:12px;color:var(--body);}" +
  ".steps-list li strong{color:var(--ink);}" +
  ".cta-box{background:var(--ink);color:var(--bg);border-radius:18px;padding:20px 22px;}" +
  ".cta-box strong{font-size:14.5px;display:block;margin-bottom:6px;}" +
  ".cta-box p{font-size:12.5px;color:rgba(244,242,235,0.68);}" +
  ".chip{display:inline-block;background:var(--mint);color:#0A5C3F;font-size:11px;font-weight:700;padding:4px 11px;border-radius:100px;margin:2px 4px 2px 0;}" +
  ".tier-badge{display:inline-block;background:var(--butter);color:var(--ink);font-size:11px;font-weight:800;padding:5px 13px;border-radius:100px;letter-spacing:.02em;}";

  return "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>" + css + "</style></head><body>" + bodyHTML + "</body></html>";
}

module.exports = { buildProposalHTML };
