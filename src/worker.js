// ============================================================
// INSPIRIT OS — Foundation Worker  v1.3.0
// 🔥 LLAMA-FRIENDLY · Slim prompts · Reliable responses
// 🌟 NYX simple router · Crew = task workers (not strategists)
// 👑 Real strategy lives with Claude in the Project chat
// ============================================================

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const GH_OWNER = "Breezusmoon";
const GH_REPO = "inspirit-os";
const GH_BRANCH = "main";
const PAGES_BASE = `https://breezusmoon.github.io/${GH_REPO}`;
const EVENTS_CAP = 2000;
const ACTIVITY_CAP = 100;

// ============================================================
// KNOWLEDGE BASE (slimmed for Llama)
// ============================================================
const DEFAULT_KB = {
  brand: { name: "Inspirit Clothing Co", tagline: "Wear your faith. Walk in purpose.", positioning: "Spiritual Badass — bold faith with urban edge", site: "inspiritclothingco.io", location: "Gold Coast, Australia" },
  products: {
    pricing_summary: "Tees $40 · Hoodies $50-60 · Bucket Hats $25 · Beanie $20",
    list: [
      { name: "Feeding 5000 Tee", price: 40, fit: "unisex" },
      { name: "Jesus Fish Tee — White", price: 40, fit: "unisex" },
      { name: "Jesus Fish Tee — Black", price: 40, fit: "unisex" },
      { name: "Spiritual Badass Tee — Black", price: 40, fit: "unisex" },
      { name: "Spiritual Badass Tee — White", price: 40, fit: "unisex" },
      { name: "Heart Tee — Black", price: 40, fit: "women's" },
      { name: "Heart Tee — White", price: 40, fit: "women's" },
      { name: "Inspirit Hoodie", price: 60, fit: "unisex" },
      { name: "Spiritual Badass Hoodie", price: 60, fit: "women's" },
      { name: "Jesus Fish Jumper", price: 50, fit: "unisex" },
      { name: "Inspirit Bucket Hat", price: 25, fit: "one-size" },
      { name: "Spiritual Badass Bucket Hat", price: 25, fit: "one-size" },
      { name: "Inspirit Beanie", price: 20, fit: "one-size" }
    ]
  },
  policies: { shipping: "AU $9.95 / Express $14.95 / FREE over $80", returns: "14 days unworn with tags", discount: "INSPIRIT10 (10% off first order)" }
};

function formatKB(kb) {
  const products = kb.products.list.map(p => `• ${p.name} ($${p.price}, ${p.fit})`).join("\n");
  return `INSPIRIT (Christian streetwear, Gold Coast AU)
Site: ${kb.brand.site} · Code: INSPIRIT10 (10% off)

Products (${kb.products.pricing_summary}):
${products}

Shipping: ${kb.policies.shipping}
Returns: ${kb.policies.returns}`;
}

async function getKB(env) {
  const raw = await env.INSPIRIT_KV.get("kb:main");
  if (!raw) { await env.INSPIRIT_KV.put("kb:main", JSON.stringify(DEFAULT_KB)); return DEFAULT_KB; }
  try { return JSON.parse(raw); } catch { return DEFAULT_KB; }
}
async function setKB(env, kb) { await env.INSPIRIT_KV.put("kb:main", JSON.stringify(kb)); }

// ============================================================
// LIBRARY
// ============================================================
async function getLibrary(env) {
  const raw = await env.INSPIRIT_KV.get("library:manifest");
  if (!raw) { const empty = { photos: [], videos: [] }; await env.INSPIRIT_KV.put("library:manifest", JSON.stringify(empty)); return empty; }
  try { return JSON.parse(raw); } catch { return { photos: [], videos: [] }; }
}
async function saveLibrary(env, lib) { await env.INSPIRIT_KV.put("library:manifest", JSON.stringify(lib)); }

function findPhotoByUrl(lib, url) {
  if (!url) return null;
  return (lib.photos || []).find(p => p.url === url) || (lib.videos || []).find(v => v.url === url) || null;
}

async function ghCommitFile(env, path, base64, message) {
  if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN secret not configured.");
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;
  let existingSha = null;
  const checkRes = await fetch(url, { headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "Inspirit-OS-Worker", "Accept": "application/vnd.github+json" } });
  if (checkRes.status === 200) { existingSha = (await checkRes.json()).sha; }
  const body = { message, content: base64, branch: GH_BRANCH };
  if (existingSha) body.sha = existingSha;
  const res = await fetch(url, { method: "PUT", headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "Inspirit-OS-Worker", "Accept": "application/vnd.github+json", "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) { const errText = await res.text(); throw new Error(`GitHub commit failed (${res.status}): ${errText.slice(0, 300)}`); }
  return await res.json();
}
function slugify(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file"; }

// ============================================================
// SHOWROOM
// ============================================================
const SITE_PAGES_BASE = "https://breezusmoon.github.io/inspirit-site/images-clean";
const DEFAULT_HEROES = {
  "Feeding 5000 Tee": `${SITE_PAGES_BASE}/model-feeding5000.jpg`,
  "Jesus Fish Tee — White": `${SITE_PAGES_BASE}/model-fishjesus.jpg`,
  "Jesus Fish Tee — Black": `${SITE_PAGES_BASE}/model-fishjesus-black.jpg`,
  "Spiritual Badass Tee — Black": `${SITE_PAGES_BASE}/model-sb.jpg`,
  "Spiritual Badass Tee — White": `${SITE_PAGES_BASE}/model-sb-white.jpg`,
  "Heart Tee — Black": `${SITE_PAGES_BASE}/model-womensheart.jpg`,
  "Heart Tee — White": `${SITE_PAGES_BASE}/model-womensheart-white.jpg`,
  "Inspirit Hoodie": `${SITE_PAGES_BASE}/model-hoodie.jpg`,
  "Spiritual Badass Hoodie": `${SITE_PAGES_BASE}/model-womenshoodie.jpg`,
  "Jesus Fish Jumper": `${SITE_PAGES_BASE}/jumper-fishjesus-model-front.jpg`,
  "Inspirit Bucket Hat": `${SITE_PAGES_BASE}/bucket-hat-inspirit.jpg`,
  "Spiritual Badass Bucket Hat": `${SITE_PAGES_BASE}/bucket-hat-sb.jpg`,
  "Inspirit Beanie": `${SITE_PAGES_BASE}/inspirit-beanie.jpg`,
};

async function getShowroom(env) {
  const raw = await env.INSPIRIT_KV.get("showroom:main");
  if (raw) { try { const sr = JSON.parse(raw); for (const p of Object.values(sr.products || {})) { if (!p.photo_captions) p.photo_captions = {}; } return sr; } catch {} }
  const kb = await getKB(env);
  const showroom = { products: {} };
  for (const p of kb.products.list) {
    showroom.products[p.name] = { name: p.name, price: p.price, fit: p.fit, hero_url: DEFAULT_HEROES[p.name] || "", captions: { instagram: null, tiktok: null, facebook: null }, photo_captions: {} };
  }
  await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom));
  return showroom;
}
async function saveShowroom(env, showroom) { await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom)); }

async function generateCaption(env, product, platform) {
  const platformInstructions = {
    instagram: `Write 1 Instagram caption. 1-2 short paragraphs. End with: shop → inspiritclothingco.io and exactly 3-5 hashtags. Bold, faith-forward, Aussie streetwear voice. NEVER cringy.`,
    tiktok: `Write 1 TikTok caption. Under 150 chars. Punchy. End with "link in bio 🔗" then 3-5 hashtags. NEVER #fyp.`,
    facebook: `Write 1 Facebook caption. 2-3 short paragraphs, story-feel. Include inspiritclothingco.io. 1-3 hashtags max.`
  };
  const messages = [
    { role: "system", content: `You write captions for ${product.name} ($${product.price}, ${product.fit}). Voice: bold, faith-forward, Aussie streetwear. Never cringy. Output ONE caption only — no preamble.\n\n${platformInstructions[platform]}` },
    { role: "user", content: `Caption for the ${product.name}.` }
  ];
  let caption = await callAI(env, messages, 500);
  caption = caption.replace(/^OPTION\s*[A-Z]\s*[—\-:]\s*[^\n]*\n+/i, "").replace(/^["']|["']$/g, "").trim();
  return caption;
}

// ============================================================
// 🛡️ SANITIZER (catches password requests)
// ============================================================
const PASSWORD_REQUEST_PATTERNS = [
  /can\s+you\s+(give|share|send|provide).{0,40}(password|login|credentials|access|token)/i,
  /(give|send|share)\s+me\s+(the\s+|your\s+)?(password|login|credentials|api\s*key)/i,
  /(I'?ll|I\s+will|I\s+can)\s+(pass|forward|relay)\s+(it|that|those)\s+on\s+to\s+(riley|nova|grace|jett|kai|atlas)/i,
  /riley\s+(needs|requires|wants)\s+(the\s+)?(facebook|instagram|tiktok|shopify|login|password|credentials|access)/i,
  /so\s+I\s+can\s+pass\s+it\s+on/i,
  /(use|using)\s+(your|the)\s+(instagram|facebook)\s+login\s+(to|details)/i,
  /(link|connect)\s+(your|the)\s+(facebook|instagram|tiktok)\s+(account|page)\s+(to|with)/i
];

function replyHasViolation(reply) {
  return PASSWORD_REQUEST_PATTERNS.some(re => re.test(reply));
}

const HARD_REFUSAL_REPLY = `I never need passwords. Crew drafts content, you post manually. Tell me what you want drafted.`;

function sanitizeReply(reply) {
  if (replyHasViolation(reply)) {
    return { reply: HARD_REFUSAL_REPLY, sanitized: true };
  }
  return { reply, sanitized: false };
}

// ============================================================
// 🌟 NYX — SIMPLE ROUTER (under 800 chars)
// ============================================================
const NYX_DNA = `You are NYX, router for Inspirit Clothing Co (Christian streetwear, Gold Coast AU).

YOUR JOB: Route Chris's request to the right crew, OR answer simple questions yourself.

CREW:
- nova = captions, copy
- grace = customer reply
- riley = social calendar (NOT TikTok)
- jett = TikTok video brief
- kai = email/Klaviyo
- atlas = paid ads, influencer

TO ROUTE: output exactly one line, e.g.
ROUTE_TO_NOVA: write 3 IG captions for spiritual badass hoodie

NEVER ask for passwords. NEVER claim crew "needs" login.

For simple questions (status, what crew does), answer in 1-3 short sentences. Don't lecture.

Be direct. No "I hope this finds you well." Match Chris's casual Aussie vibe.`;

function nyxPrompt(kbBlock) {
  return `${NYX_DNA}\n\n${kbBlock}`;
}

// ============================================================
// 🎨 NOVA — SIMPLE COPYWRITER (under 1000 chars)
// ============================================================
const NOVA_DNA = `You are NOVA, copywriter for Inspirit Clothing Co.

VOICE: Bold, faith-forward, Aussie streetwear. Never cringy. Confession voice ("I made this because…"). No "blessed beyond measure" type clichés.

OUTPUT: 3 caption options. Each different angle.

FORMAT:
A) [caption with hashtags]
B) [caption with hashtags]
C) [caption with hashtags]

PLATFORM RULES:
- Instagram: 1-2 paragraphs, end with shop → inspiritclothingco.io then 3-5 hashtags
- Facebook: 2-3 paragraphs, include URL inline, 1-3 hashtags
- TikTok: under 150 chars, end "link in bio 🔗" + 3-5 hashtags. NEVER #fyp.

OWNED HASHTAGS: #christianstreetwear #spiritualbadass #aussiestreetwear #inspiritclothingco

Default platform = Instagram unless Chris says otherwise.

If Chris asks for TikTok video copy, say: "Route to Jett — that's his lane."`;

function novaPrompt(kbBlock) {
  return `${NOVA_DNA}\n\n${kbBlock}`;
}

// ============================================================
// 💚 GRACE — CUSTOMER REPLY (under 600 chars)
// ============================================================
function gracePrompt(kbBlock) {
  return `You are Grace, customer service for Inspirit Clothing Co.

VOICE: Warm, friendly, light Aussie. 1-3 short paragraphs.

FORMAT:
Hi [name or "there"],

[answer using KB facts only]

Grace from Inspirit 🙏

If you can't answer with KB info, output:
ESCALATE_TO_CHRIS: <one-line summary>

NEVER invent prices, sizes, or policies.

${kbBlock}`;
}

// ============================================================
// 🔵 RILEY — SOCIAL PLAN (under 1000 chars)
// ============================================================
const RILEY_DNA = `You are RILEY, social strategist for Inspirit Clothing Co (Christian streetwear, Gold Coast AU).

YOU PLAN: Instagram, Pinterest, Threads, Facebook, YouTube Shorts.
YOU DON'T PLAN: TikTok (route to Jett).

OUTPUT: Calendar table OR strategy memo (Chris will tell you which).

DEFAULT CALENDAR FORMAT:
| DAY | PLATFORM | TYPE | HOOK | POST TIME (AEST) |

5 CONTENT PILLARS:
1. Founder POV (Chris's truck driver story)
2. Drop hype
3. Product reveal (back-print)
4. Faith moments
5. UGC/community

HASHTAG LIMITS:
- IG: 3-5
- Facebook: 1-3
- Threads: 1
- Pinterest: 5-10
- YouTube Shorts: 3-5

NEVER ask for login or "access." You don't post — Chris does.

If asked for TikTok output: ROUTE_TO_JETT: <brief>`;

function rileyPrompt(kbBlock) {
  return `${RILEY_DNA}\n\n${kbBlock}`;
}

// ============================================================
// 🎬 JETT — TIKTOK VIDEO (under 1200 chars)
// ============================================================
const JETT_DNA = `You are JETT, TikTok video producer for Inspirit Clothing Co.

OUTPUT FORMAT (use exactly this structure):

🎬 [VIDEO TITLE]
DURATION: [seconds]

⚡ HOOK (0-3s): "[exact words]"

🎥 SHOTS:
0:00-0:03 — [direction]
0:04-0:08 — [direction]
0:09-0:15 — [direction]

🎵 SOUND: [trending audio OR original VO]

✍️ CAPTION OPTIONS:
A) [save-bait caption + hashtags]
B) [share-bait caption + hashtags]
C) [comment-bait caption + hashtags]

#️⃣ HASHTAGS: 3-5 max. NEVER #fyp #foryou.
Owned: #christianstreetwear #spiritualbadass #aussiestreetwear #inspiritclothingco

⏰ POST TIME (AEST): [day + time]

5 PILLARS: Founder POV / Drop hype / Product reveal / Faith moments / UGC

HOOKS: Curiosity gap / Contrarian / POV / Specific number / Demonstration / Personal stakes

First 3 sec = 71% of retention. Save rate > likes. Native beats studio.

Best AEST times: 7am · 12pm · 7-9pm. Sundays 11am + 7pm = goldmine for faith content.`;

function jettPrompt(kbBlock) {
  return `${JETT_DNA}\n\n${kbBlock}`;
}

// ============================================================
// 📧 KAI — EMAIL DRAFTER (under 1100 chars)
// ============================================================
const KAI_DNA = `You are KAI, email writer for Inspirit Clothing Co.

VOICE: Founder voice, like Chris (the founder, truck driver, Gold Coast). First-person. Short sentences. ONE clear CTA.

NEVER write: "Hey [first_name]!" / "We hope this finds you well" / "Don't miss out!!"

OUTPUT FORMAT:

📧 [FLOW NAME]
SUBJECT: [under 40 chars]
PREVIEW: [under 90 chars]

[body — short paragraphs]

CTA: [4-5 word button]

Sign-off: "Chris" or "Chris from Inspirit 🤙"

THE 5 FLOWS (use the right one):
- WELCOME: 3 emails. E1=welcome+INSPIRIT10. E2 (Day 2)=founder story. E3 (Day 5)=code expires.
- BROWSE ABANDON: 1 email, 4hrs after view.
- CART ABANDON: 3 emails (1hr/24hr/48hr). E3 has 5% code (NOT 10%).
- POST-PURCHASE: 4 emails over 30 days. Day 0=thanks. Day 7=UGC ask. Day 14=review. Day 30=cross-sell.
- WIN-BACK: 2 emails for 60+ day inactives.

If Chris asks for "campaign" = one-off marketing email.

ALWAYS include unsubscribe + AU address line.`;

function kaiPrompt(kbBlock) {
  return `${KAI_DNA}\n\n${kbBlock}`;
}

// ============================================================
// 📊 ATLAS — GROWTH (under 1100 chars)
// ============================================================
const ATLAS_DNA = `You are ATLAS, growth strategist for Inspirit Clothing Co.

🚨 REFUSE TO RUN ADS if ANY:
- Less than 1,000 IG followers
- Less than 50 orders total
- AOV under $40
- Site CVR under 2%
- No retargeting pixel for 30+ days

If refusing: say "Hold ads. Organic first." then suggest a Riley brief.

PAID PLAYBOOK (when ready):
PHASE 1: Meta $20/day, Sales objective, AU 18-35 broad, 4-6 Reel creatives. KPI: 3:1 ROAS.
PHASE 2: TikTok Spark Ads $30/day, boost top organic. KPI: 2:1 ROAS.
PHASE 3: Retargeting $5/day always-on. KPI: 5:1 ROAS.

INFLUENCER PLAYBOOK:
TARGETS: Christian micros AU (1k-20k), AU streetwear micros, Christian podcast hosts.
SKIP: Mega (100k+), generic faith accounts, under 3% engagement.

DM OPENER: "Hey [name], been following [specific reference]. I run a Christian streetwear brand on the Gold Coast called Inspirit. Keen on a free piece? No expectations. [pic attached]. Sound like something you'd wear?"

OUTPUT: short, structured. CAC, ROAS, and timeline always included.

Hand off video creative to Jett. Hand off ad copy to Nova.`;

function atlasPrompt(kbBlock) {
  return `${ATLAS_DNA}\n\n${kbBlock}`;
}

// ============================================================
// HELPERS
// ============================================================
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } }); }

async function callAI(env, messages, max_tokens = 1024) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await env.AI.run(MODEL, { messages, max_tokens });
      const out = (res.response || res.result?.response || "").trim();
      if (out) return out;
      throw new Error("empty AI response");
    } catch (err) {
      if (attempt === 0) { await new Promise(r => setTimeout(r, 800)); continue; }
      throw err;
    }
  }
}

function buildLiveStatsBlock(stats, queues) {
  return `\nSTATUS: $${stats.today_revenue||0} today · ${stats.today_orders||0} orders · ${stats.today_visitors||0} visitors. PENDING: nova ${queues.nova_pending} grace ${queues.grace_pending} riley ${queues.riley_pending} jett ${queues.jett_pending} kai ${queues.kai_pending} atlas ${queues.atlas_pending}.`;
}

function extractRouting(reply) {
  const patterns = [
    { key: "nova", re: /ROUTE_TO_NOVA\s*:\s*([^\n]+)/i },
    { key: "grace", re: /ROUTE_TO_GRACE\s*:\s*([^\n]+)/i },
    { key: "riley", re: /ROUTE_TO_RILEY\s*:\s*([^\n]+)/i },
    { key: "jett", re: /ROUTE_TO_JETT\s*:\s*([^\n]+)/i },
    { key: "kai", re: /ROUTE_TO_KAI\s*:\s*([^\n]+)/i },
    { key: "atlas", re: /ROUTE_TO_ATLAS\s*:\s*([^\n]+)/i }
  ];
  for (const p of patterns) {
    const m = reply.match(p.re);
    if (m) {
      let brief = m[1].trim().replace(/^[*_"'`]+|[*_"'`]+$/g, "").trim();
      if (brief.length >= 5) return { target: p.key, brief };
    }
  }
  return null;
}

function stripRoutingTokens(reply) {
  return reply.split("\n").filter(line => !/ROUTE_TO_(NOVA|GRACE|RILEY|JETT|KAI|ATLAS)/i.test(line)).filter(line => !/^\s*\**\s*Option\s+[A-Z0-9]+\s*:?\s*\**\s*$/i.test(line)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ============================================================
// CREW EXECUTION
// ============================================================
async function nyxChat(env, message, sessionId) {
  const historyKey = `sage:chat:${sessionId}`;
  const historyRaw = await env.INSPIRIT_KV.get(historyKey);
  const history = historyRaw ? JSON.parse(historyRaw) : [];

  const [stats, queues, kb] = await Promise.all([getStats(env), getQueueCounts(env), getKB(env)]);
  const systemPrompt = nyxPrompt(formatKB(kb)) + buildLiveStatsBlock(stats, queues);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message }
  ];

  let reply = await callAI(env, messages, 600);
  let routedDraft = null;
  const routing = extractRouting(reply);
  if (routing) {
    if (routing.target === "nova") { routedDraft = await novaDraft(env, routing.brief); reply = stripRoutingTokens(reply) || "Nova's drafting now."; reply += `\n\n— Nova drafted ${routedDraft.options} options. Check the queue.`; }
    else if (routing.target === "grace") { routedDraft = await graceReply(env, routing.brief); reply = stripRoutingTokens(reply) || "Grace is on it."; reply += `\n\n— Grace drafted a reply. Check Grace's queue.`; }
    else if (routing.target === "riley") { routedDraft = await rileyPlan(env, routing.brief); reply = stripRoutingTokens(reply) || "Riley's putting together a plan."; reply += `\n\n— Riley plan ready. Check Riley's queue.`; }
    else if (routing.target === "jett") { routedDraft = await jettBrief(env, routing.brief, "daily"); reply = stripRoutingTokens(reply) || "Jett's on it."; reply += `\n\n— Jett dropped a video brief. Check Jett's queue.`; }
    else if (routing.target === "kai") { routedDraft = await kaiDraft(env, routing.brief, "general"); reply = stripRoutingTokens(reply) || "Kai's drafting now."; reply += `\n\n— Kai dropped an email draft. Check Kai's queue.`; }
    else if (routing.target === "atlas") { routedDraft = await atlasDraft(env, routing.brief, "general"); reply = stripRoutingTokens(reply) || "Atlas is on it."; reply += `\n\n— Atlas dropped a growth plan. Check Atlas's queue.`; }
  } else reply = stripRoutingTokens(reply);

  const sanitized = sanitizeReply(reply);
  if (sanitized.sanitized) { reply = sanitized.reply; await logActivity(env, "nyx", "sanitized-violation", { preview: message.slice(0, 80) }); }

  history.push({ role: "user", content: message, ts: Date.now() });
  history.push({ role: "assistant", content: reply, ts: Date.now() });
  while (history.length > 30) history.shift();
  await env.INSPIRIT_KV.put(historyKey, JSON.stringify(history));
  await logActivity(env, "nyx", "chat", { preview: message.slice(0, 80) });
  return { reply, routedDraft };
}

async function novaDraft(env, brief) {
  const kb = await getKB(env);
  const messages = [{ role: "system", content: novaPrompt(formatKB(kb)) }, { role: "user", content: brief }];
  const output = await callAI(env, messages, 1200);
  const item = { id: crypto.randomUUID(), crew: "nova", brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "nova:queue", item);
  await logActivity(env, "nova", "draft", { brief: brief.slice(0, 80) });
  return { id: item.id, output, options: 3 };
}

async function graceReply(env, customerMessage, opts = {}) {
  const kb = await getKB(env);
  const messages = [{ role: "system", content: gracePrompt(formatKB(kb)) }, { role: "user", content: customerMessage }];
  const output = await callAI(env, messages, 800);
  const escalateMatch = output.match(/ESCALATE_TO_CHRIS\s*:\s*(.+)/i);
  const escalated = !!escalateMatch;
  const item = { id: crypto.randomUUID(), crew: "grace", brief: customerMessage, output: escalated ? `[ESCALATED]\n${escalateMatch[1].trim()}` : output, customer_email: opts.from || null, customer_subject: opts.subject || null, ts: Date.now(), status: escalated ? "escalated" : "pending" };
  await pushQueue(env, "grace:queue", item);
  await logActivity(env, "grace", escalated ? "escalation" : "draft", { from: opts.from || "manual", preview: customerMessage.slice(0, 80) });
  return { id: item.id, output: item.output, escalated };
}

async function rileyPlan(env, brief) {
  const kb = await getKB(env);
  const messages = [{ role: "system", content: rileyPrompt(formatKB(kb)) }, { role: "user", content: brief }];
  const output = await callAI(env, messages, 1200);
  const sanitized = sanitizeReply(output);
  let finalOutput = output;
  if (sanitized.sanitized) { finalOutput = sanitized.reply; await logActivity(env, "riley", "sanitized-violation", { brief: brief.slice(0, 80) }); }
  const routing = extractRouting(finalOutput);
  if (routing && routing.target === "jett") {
    const jettResult = await jettBrief(env, routing.brief, "daily");
    const cleanedOutput = stripRoutingTokens(finalOutput);
    const item = { id: crypto.randomUUID(), crew: "riley", brief, output: cleanedOutput + `\n\n— Handed to Jett: ${jettResult.id}`, ts: Date.now(), status: "pending" };
    await pushQueue(env, "riley:queue", item);
    await logActivity(env, "riley", "plan-handoff-jett", { brief: brief.slice(0, 80) });
    return { id: item.id, output: item.output };
  }
  const item = { id: crypto.randomUUID(), crew: "riley", brief, output: finalOutput, ts: Date.now(), status: "pending" };
  await pushQueue(env, "riley:queue", item);
  await logActivity(env, "riley", "plan", { brief: brief.slice(0, 80) });
  return { id: item.id, output: finalOutput };
}

async function jettBrief(env, brief, mode = "daily") {
  const kb = await getKB(env);
  let userMessage = brief;
  if (mode === "daily") userMessage = `Plan ONE shoot-ready TikTok video. ${brief}`;
  else if (mode === "week") userMessage = `Plan 7 TikToks for the next 7 days, mixing the 5 pillars. ${brief}`;
  else if (mode === "hook-lab") userMessage = `Give 5 hook variations for: ${brief}`;
  else if (mode === "audit") userMessage = `Diagnose what's working from these stats:\n${brief}`;
  else if (mode === "trend-steal") userMessage = `Adapt this viral video for Inspirit:\n${brief}`;
  const messages = [{ role: "system", content: jettPrompt(formatKB(kb)) }, { role: "user", content: userMessage }];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "jett", mode, brief, output, ts: Date.now(), status: "planned" };
  await pushQueue(env, "jett:queue", item);
  await logActivity(env, "jett", `video-${mode}`, { brief: brief.slice(0, 80) });
  return { id: item.id, output, mode };
}

async function kaiDraft(env, brief, mode = "general") {
  const kb = await getKB(env);
  let userMessage = brief;
  if (mode === "welcome") userMessage = `Write the WELCOME SERIES (3 emails). ${brief}`;
  else if (mode === "abandoned-cart") userMessage = `Write the ABANDONED CART flow (3 emails: 1hr/24hr/48hr). ${brief}`;
  else if (mode === "post-purchase") userMessage = `Write the POST-PURCHASE flow (4 emails over 30 days). ${brief}`;
  else if (mode === "win-back") userMessage = `Write the WIN-BACK flow (2 emails). ${brief}`;
  else if (mode === "campaign") userMessage = `Write a one-off marketing email. ${brief}`;
  else if (mode === "insight") userMessage = `Find patterns in this customer data and give a takeaway + action:\n${brief}`;
  const messages = [{ role: "system", content: kaiPrompt(formatKB(kb)) }, { role: "user", content: userMessage }];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "kai", mode, brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "kai:queue", item);
  await logActivity(env, "kai", `email-${mode}`, { brief: brief.slice(0, 80) });
  return { id: item.id, output, mode };
}

async function atlasDraft(env, brief, mode = "general") {
  const kb = await getKB(env);
  let userMessage = brief;
  if (mode === "ads") userMessage = `Plan a paid ads campaign. ${brief}`;
  else if (mode === "influencer") userMessage = `Plan influencer outreach. ${brief}`;
  else if (mode === "audit") userMessage = `Growth audit. ${brief}`;
  else if (mode === "dm-script") userMessage = `Write a DM script. Target: ${brief}`;
  const messages = [{ role: "system", content: atlasPrompt(formatKB(kb)) }, { role: "user", content: userMessage }];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "atlas", mode, brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "atlas:queue", item);
  await logActivity(env, "atlas", `growth-${mode}`, { brief: brief.slice(0, 80) });
  return { id: item.id, output, mode };
}

// ============================================================
// QUEUES + ACTIVITY + STATS + EMAIL
// ============================================================
async function pushQueue(env, key, item) {
  const raw = await env.INSPIRIT_KV.get(key);
  const queue = raw ? JSON.parse(raw) : [];
  queue.unshift(item);
  while (queue.length > 50) queue.pop();
  await env.INSPIRIT_KV.put(key, JSON.stringify(queue));
}
async function getQueueCounts(env) {
  const [novaRaw, graceRaw, rileyRaw, jettRaw, kaiRaw, atlasRaw] = await Promise.all([
    env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"),
    env.INSPIRIT_KV.get("riley:queue"), env.INSPIRIT_KV.get("jett:queue"),
    env.INSPIRIT_KV.get("kai:queue"), env.INSPIRIT_KV.get("atlas:queue")
  ]);
  const nova = novaRaw ? JSON.parse(novaRaw) : [];
  const grace = graceRaw ? JSON.parse(graceRaw) : [];
  const riley = rileyRaw ? JSON.parse(rileyRaw) : [];
  const jett = jettRaw ? JSON.parse(jettRaw) : [];
  const kai = kaiRaw ? JSON.parse(kaiRaw) : [];
  const atlas = atlasRaw ? JSON.parse(atlasRaw) : [];
  return {
    nova_pending: nova.filter(q => q.status === "pending").length,
    grace_pending: grace.filter(q => q.status === "pending").length,
    riley_pending: riley.filter(q => q.status === "pending").length,
    jett_pending: jett.filter(q => q.status === "planned" || q.status === "filmed").length,
    kai_pending: kai.filter(q => q.status === "pending").length,
    atlas_pending: atlas.filter(q => q.status === "pending").length,
    escalations: grace.filter(q => q.status === "escalated").length
  };
}
async function updateQueueItem(env, key, body) {
  const { id, status } = body;
  const raw = await env.INSPIRIT_KV.get(key);
  const queue = raw ? JSON.parse(raw) : [];
  const item = queue.find(q => q.id === id);
  if (item) { item.status = status; item.reviewedAt = Date.now(); await env.INSPIRIT_KV.put(key, JSON.stringify(queue)); }
  return json({ ok: !!item });
}
async function logActivity(env, crew, action, meta = {}) {
  const raw = await env.INSPIRIT_KV.get("activity:manifest");
  const activity = raw ? JSON.parse(raw) : [];
  activity.unshift({ crew, action, meta, ts: Date.now() });
  while (activity.length > ACTIVITY_CAP) activity.pop();
  await env.INSPIRIT_KV.put("activity:manifest", JSON.stringify(activity));
}
async function getActivity(env, limit = 30) {
  const raw = await env.INSPIRIT_KV.get("activity:manifest");
  const items = raw ? JSON.parse(raw) : [];
  return items.slice(0, limit);
}
async function trackEvent(env, event) {
  const raw = await env.INSPIRIT_KV.get("events:manifest");
  const events = raw ? JSON.parse(raw) : [];
  events.unshift({ ...event, ts: Date.now() });
  while (events.length > EVENTS_CAP) events.pop();
  await env.INSPIRIT_KV.put("events:manifest", JSON.stringify(events));
}
async function getEvents(env) {
  const raw = await env.INSPIRIT_KV.get("events:manifest");
  return raw ? JSON.parse(raw) : [];
}
async function getStats(env) {
  const events = await getEvents(env);
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const todays = events.filter(e => new Date(e.ts).toISOString().slice(0, 10) === today);
  const weekly = events.filter(e => e.ts >= weekAgo);
  const todayOrders = todays.filter(e => e.type === "order");
  const todayPv = todays.filter(e => e.type === "pageview");
  const todaySessions = new Set(todayPv.map(e => e.session).filter(Boolean));
  const weekOrders = weekly.filter(e => e.type === "order");
  const weekPv = weekly.filter(e => e.type === "pageview");
  const weekSessions = new Set(weekPv.map(e => e.session).filter(Boolean));
  const dailyBreakdown = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dKey = d.toISOString().slice(0, 10);
    const dEv = events.filter(e => new Date(e.ts).toISOString().slice(0, 10) === dKey);
    const dOrd = dEv.filter(e => e.type === "order");
    const dPv = dEv.filter(e => e.type === "pageview");
    const dSess = new Set(dPv.map(e => e.session).filter(Boolean));
    dailyBreakdown.push({ date: dKey, label: d.toLocaleDateString("en-AU", { weekday: "short" }), revenue: dOrd.reduce((a, e) => a + (Number(e.amount) || 0), 0), orders: dOrd.length, visitors: dSess.size, pageviews: dPv.length });
  }
  const queues = await getQueueCounts(env);
  return {
    today_revenue: todayOrders.reduce((a, e) => a + (Number(e.amount) || 0), 0),
    today_orders: todayOrders.length,
    today_visitors: todaySessions.size,
    today_pageviews: todayPv.length,
    week_revenue: weekOrders.reduce((a, e) => a + (Number(e.amount) || 0), 0),
    week_orders: weekOrders.length,
    week_visitors: weekSessions.size,
    week_pageviews: weekPv.length,
    daily: dailyBreakdown,
    pending_drafts: queues.nova_pending,
    pending_replies: queues.grace_pending,
    pending_plans: queues.riley_pending,
    pending_videos: queues.jett_pending,
    pending_emails: queues.kai_pending,
    pending_growth: queues.atlas_pending,
    escalations: queues.escalations,
    crew_online: 7, crew_total: 8
  };
}
async function handleEmail(message, env) {
  const raw = await new Response(message.raw).text();
  const fromMatch = raw.match(/^From:\s*(.+)$/im);
  const subjMatch = raw.match(/^Subject:\s*(.+)$/im);
  const from = fromMatch ? fromMatch[1].trim() : "unknown";
  const subject = subjMatch ? subjMatch[1].trim() : "(no subject)";
  const bodyStart = raw.indexOf("\r\n\r\n");
  let body = bodyStart > 0 ? raw.slice(bodyStart + 4) : raw;
  body = body.replace(/<[^>]+>/g, "").replace(/\r/g, "").trim().slice(0, 4000);
  const customerMessage = `Subject: ${subject}\n\nFrom: ${from}\n\n${body}`;
  await graceReply(env, customerMessage, { from, subject });
}

// ============================================================
// ROUTER
// ============================================================
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/" || path === "/api" || path === "/api/health") {
        return json({
          service: "Inspirit OS",
          version: "1.3.0 — Llama-Friendly · Slim prompts · Reliable",
          crew_online: ["nyx", "nova", "grace", "riley", "jett", "kai", "atlas"],
          knowledge_base: "loaded",
          library: "ready",
          github_token: env.GITHUB_TOKEN ? "configured" : "MISSING",
          time: new Date().toISOString()
        });
      }

      if (path === "/api/sage/chat" && request.method === "POST") {
        const { message, sessionId = "default" } = await request.json();
        if (!message?.trim()) return json({ error: "message required" }, 400);
        return json({ from: "nyx", ...(await nyxChat(env, message.trim(), sessionId)) });
      }
      if (path === "/api/sage/history" && request.method === "GET") {
        const sessionId = url.searchParams.get("sessionId") || "default";
        const raw = await env.INSPIRIT_KV.get(`sage:chat:${sessionId}`);
        return json({ history: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/sage/clear" && request.method === "POST") {
        const { sessionId = "default" } = await request.json();
        await env.INSPIRIT_KV.delete(`sage:chat:${sessionId}`);
        return json({ ok: true });
      }

      if (path === "/api/nova/draft" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "nova", ...(await novaDraft(env, brief.trim())) });
      }
      if (path === "/api/nova/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("nova:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/nova/queue/update" && request.method === "POST") return updateQueueItem(env, "nova:queue", await request.json());

      if (path === "/api/grace/draft" && request.method === "POST") {
        const { customer_message, from, subject } = await request.json();
        if (!customer_message?.trim()) return json({ error: "customer_message required" }, 400);
        return json({ from: "grace", ...(await graceReply(env, customer_message.trim(), { from, subject })) });
      }
      if (path === "/api/grace/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("grace:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/grace/queue/update" && request.method === "POST") return updateQueueItem(env, "grace:queue", await request.json());

      if (path === "/api/riley/plan" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "riley", ...(await rileyPlan(env, brief.trim())) });
      }
      if (path === "/api/riley/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("riley:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/riley/queue/update" && request.method === "POST") return updateQueueItem(env, "riley:queue", await request.json());

      if (path === "/api/jett/brief" && request.method === "POST") {
        const { brief, mode = "daily" } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        if (!["daily", "week", "hook-lab", "audit", "trend-steal"].includes(mode)) return json({ error: "invalid mode" }, 400);
        return json({ from: "jett", ...(await jettBrief(env, brief.trim(), mode)) });
      }
      if (path === "/api/jett/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("jett:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/jett/queue/update" && request.method === "POST") return updateQueueItem(env, "jett:queue", await request.json());

      if (path === "/api/kai/draft" && request.method === "POST") {
        const { brief, mode = "general" } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        if (!["general", "welcome", "abandoned-cart", "post-purchase", "win-back", "campaign", "insight"].includes(mode)) return json({ error: "invalid mode" }, 400);
        return json({ from: "kai", ...(await kaiDraft(env, brief.trim(), mode)) });
      }
      if (path === "/api/kai/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("kai:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/kai/queue/update" && request.method === "POST") return updateQueueItem(env, "kai:queue", await request.json());

      if (path === "/api/atlas/draft" && request.method === "POST") {
        const { brief, mode = "general" } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        if (!["general", "ads", "influencer", "audit", "dm-script"].includes(mode)) return json({ error: "invalid mode" }, 400);
        return json({ from: "atlas", ...(await atlasDraft(env, brief.trim(), mode)) });
      }
      if (path === "/api/atlas/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("atlas:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/atlas/queue/update" && request.method === "POST") return updateQueueItem(env, "atlas:queue", await request.json());

      if (path === "/api/kb" && request.method === "GET") return json(await getKB(env));
      if (path === "/api/kb" && request.method === "POST") { await setKB(env, await request.json()); return json({ ok: true }); }
      if (path === "/api/kb/reset" && request.method === "POST") { await setKB(env, DEFAULT_KB); return json({ ok: true, reset: true }); }

      if (path === "/api/showroom" && request.method === "GET") {
        const [showroom, lib] = await Promise.all([getShowroom(env), getLibrary(env)]);
        const result = { products: {} };
        for (const [name, prod] of Object.entries(showroom.products)) {
          const extras = (lib.photos || []).filter(p => (p.products || []).includes(name));
          const videos = (lib.videos || []).filter(v => (v.products || []).includes(name));
          result.products[name] = { ...prod, extras, videos };
        }
        return json(result);
      }
      if (path === "/api/showroom/hero" && request.method === "POST") {
        const { name, hero_url } = await request.json();
        if (!name) return json({ error: "name required" }, 400);
        const showroom = await getShowroom(env);
        if (!showroom.products[name]) return json({ error: "unknown product" }, 404);
        showroom.products[name].hero_url = hero_url || "";
        await saveShowroom(env, showroom);
        return json({ ok: true });
      }
      if (path === "/api/showroom/caption" && request.method === "POST") {
        const { name, platform, regenerate, photo_url } = await request.json();
        if (!name || !["instagram", "tiktok", "facebook"].includes(platform)) return json({ error: "name + valid platform required" }, 400);
        const showroom = await getShowroom(env);
        const prod = showroom.products[name];
        if (!prod) return json({ error: "unknown product" }, 404);
        const photoKey = photo_url || "default";
        prod.photo_captions = prod.photo_captions || {};
        prod.photo_captions[photoKey] = prod.photo_captions[photoKey] || {};
        if (!regenerate && prod.photo_captions[photoKey][platform]) return json({ caption: prod.photo_captions[photoKey][platform], cached: true, photo_url: photo_url || null });
        const caption = await generateCaption(env, prod, platform);
        prod.photo_captions[photoKey][platform] = caption;
        if (!photo_url || photo_url === prod.hero_url) prod.captions[platform] = caption;
        await saveShowroom(env, showroom);
        await logActivity(env, "nova", "caption", { product: name, platform, photo: photo_url ? "specific" : "default" });
        return json({ caption, cached: false, photo_url: photo_url || null });
      }
      if (path === "/api/showroom/seed" && request.method === "POST") {
        const showroom = await getShowroom(env);
        let generated = 0;
        for (const [name, prod] of Object.entries(showroom.products)) {
          for (const platform of ["instagram", "tiktok", "facebook"]) {
            if (!prod.captions[platform]) {
              try { prod.captions[platform] = await generateCaption(env, prod, platform); generated++; }
              catch (err) { console.error(`Failed ${name}/${platform}:`, err.message); }
            }
          }
        }
        await saveShowroom(env, showroom);
        return json({ ok: true, generated });
      }
      if (path === "/api/showroom/reset" && request.method === "POST") { await env.INSPIRIT_KV.delete("showroom:main"); return json({ ok: true, reset: true }); }

      if (path === "/api/library" && request.method === "GET") return json(await getLibrary(env));
      if (path === "/api/library/upload" && request.method === "POST") {
        const body = await request.json();
        if (!["photo", "video"].includes(body.type)) return json({ error: "type must be photo or video" }, 400);
        if (!body.base64) return json({ error: "base64 required" }, 400);
        if (!body.filename) return json({ error: "filename required" }, 400);
        const ext = (body.filename.split(".").pop() || "bin").toLowerCase();
        const id = `${slugify(body.filename.replace(/\.[^.]+$/, ""))}-${Date.now().toString(36)}`;
        const folder = body.type === "photo" ? "library/photos" : "library/videos";
        const filePath = `${folder}/${id}.${ext}`;
        const fileUrl = `${PAGES_BASE}/${filePath}`;
        await ghCommitFile(env, filePath, body.base64, `[Inspirit OS] add ${body.type}: ${id}`);
        const lib = await getLibrary(env);
        const item = { id, filename: body.filename, path: filePath, url: fileUrl, mime: body.mime || "", type: body.type, products: Array.isArray(body.products) ? body.products : [], tags: Array.isArray(body.tags) ? body.tags : [], notes: body.notes || "", uploadedAt: Date.now() };
        if (body.type === "photo") lib.photos.unshift(item); else lib.videos.unshift(item);
        await saveLibrary(env, lib);
        await logActivity(env, "library", "upload", { type: body.type, id });
        return json({ ok: true, item });
      }
      if (path === "/api/library/update" && request.method === "POST") {
        const body = await request.json();
        const lib = await getLibrary(env);
        const arr = body.type === "photo" ? lib.photos : lib.videos;
        const item = arr.find(x => x.id === body.id);
        if (!item) return json({ error: "not found" }, 404);
        if (Array.isArray(body.products)) item.products = body.products;
        if (Array.isArray(body.tags)) item.tags = body.tags;
        if (typeof body.notes === "string") item.notes = body.notes;
        await saveLibrary(env, lib);
        return json({ ok: true, item });
      }
      if (path === "/api/library/bulk-update" && request.method === "POST") {
        const body = await request.json();
        if (!["photo", "video"].includes(body.type)) return json({ error: "type required" }, 400);
        if (!Array.isArray(body.ids) || !body.ids.length) return json({ error: "ids array required" }, 400);
        const lib = await getLibrary(env);
        const arr = body.type === "photo" ? lib.photos : lib.videos;
        let updated = 0;
        for (const id of body.ids) {
          const item = arr.find(x => x.id === id);
          if (!item) continue;
          if (Array.isArray(body.replaceProducts)) item.products = [...body.replaceProducts];
          else if (Array.isArray(body.addProducts)) item.products = [...new Set([...(item.products || []), ...body.addProducts])];
          if (Array.isArray(body.replaceTags)) item.tags = [...body.replaceTags];
          else if (Array.isArray(body.addTags)) item.tags = [...new Set([...(item.tags || []), ...body.addTags])];
          if (typeof body.setNotes === "string") item.notes = body.setNotes;
          updated++;
        }
        await saveLibrary(env, lib);
        await logActivity(env, "library", "bulk-update", { count: updated });
        return json({ ok: true, updated });
      }
      if (path === "/api/library/delete" && request.method === "POST") {
        const body = await request.json();
        const lib = await getLibrary(env);
        const arr = body.type === "photo" ? lib.photos : lib.videos;
        const idx = arr.findIndex(x => x.id === body.id);
        if (idx < 0) return json({ error: "not found" }, 404);
        const item = arr[idx];
        arr.splice(idx, 1);
        await saveLibrary(env, lib);
        await logActivity(env, "library", "remove", { type: body.type, id: item.id });
        return json({ ok: true });
      }

      if (path === "/api/track" && request.method === "POST") { await trackEvent(env, await request.json()); return json({ ok: true }); }
      if (path === "/api/stats" && request.method === "GET") return json(await getStats(env));
      if (path === "/api/activity" && request.method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "30");
        return json({ activity: await getActivity(env, limit) });
      }
      if (path === "/api/attention" && request.method === "GET") {
        const [novaRaw, graceRaw, rileyRaw, jettRaw, kaiRaw, atlasRaw] = await Promise.all([
          env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"),
          env.INSPIRIT_KV.get("riley:queue"), env.INSPIRIT_KV.get("jett:queue"),
          env.INSPIRIT_KV.get("kai:queue"), env.INSPIRIT_KV.get("atlas:queue")
        ]);
        const nova = (novaRaw ? JSON.parse(novaRaw) : []).filter(q => q.status === "pending");
        const grace = (graceRaw ? JSON.parse(graceRaw) : []).filter(q => q.status === "pending" || q.status === "escalated");
        const riley = (rileyRaw ? JSON.parse(rileyRaw) : []).filter(q => q.status === "pending");
        const jett = (jettRaw ? JSON.parse(jettRaw) : []).filter(q => q.status === "planned" || q.status === "filmed");
        const kai = (kaiRaw ? JSON.parse(kaiRaw) : []).filter(q => q.status === "pending");
        const atlas = (atlasRaw ? JSON.parse(atlasRaw) : []).filter(q => q.status === "pending");
        const all = [...nova, ...grace, ...riley, ...jett, ...kai, ...atlas].sort((a, b) => b.ts - a.ts);
        return json({ items: all });
      }

      return json({ error: "not found", path }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: err.message, stack: err.stack }, 500);
    }
  },

  async email(message, env, ctx) {
    try { await handleEmail(message, env); }
    catch (err) { console.error("email handler error:", err); }
  }
};
