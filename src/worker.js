// ============================================================
// INSPIRIT OS — Foundation Worker  v0.9
// + Per-photo captions (LLM gets photo metadata for richer copy)
// + Per-photo caption cache (each shot keeps its own IG/TikTok/FB)
// + AI retry on failure
// + Bulk library update endpoint
// + Manifest pattern (no list() calls, unlimited)
// ============================================================

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const GH_OWNER = "Breezusmoon";
const GH_REPO = "inspirit-os";
const GH_BRANCH = "main";
const PAGES_BASE = `https://breezusmoon.github.io/${GH_REPO}`;
const EVENTS_CAP = 2000;
const ACTIVITY_CAP = 100;

// ============================================================
// KNOWLEDGE BASE
// ============================================================
const DEFAULT_KB = {
  brand: { name: "Inspirit Clothing Co", tagline: "Wear your faith. Walk in purpose.", positioning: "Spiritual Badass — bold faith with urban edge", site: "inspiritclothingco.io", age: "First year — just launched 2026", location: "Gold Coast, Queensland, Australia", handprinted: "Yes — handprinted in Australia" },
  origin: { why: "Started by Chris (Breezus) on a personal faith journey. Wanted to wear faith loud, on the chest and on the back, in a way that felt like streetwear and not church merch.", spiritual_badass_meaning: "Bold faith — unafraid, unapologetic, owning it. Faith that walks through fire — strong, tested, real. Faith with edge — not soft, not corporate. The Spiritual Badass owns their faith without apology.", founder: "Chris (Breezus) — truck driver, Gold Coast, building Inspirit solo alongside other ventures (BlockHunt, Miner Finder AU)." },
  audience: { age: "Mix of youth and young adults (broadly 16-30, leaning early 20s)", location: "Australia-only currently", gender: "Even split men/women", profile: "Young Christians who want streetwear that reflects their faith without being cringe. They want to wear it out — to the gym, to uni, on the streets — not just to church." },
  voice: { overall: "Casual but light on slang — not bogan. Faith-forward but never preachy. Aussie cadence and warmth without overdoing 'mate'.", marketing_faith: "MIX — explicit faith language on Stories/social posts ('Jesus', 'cross', 'faith'). Subtler on product pages — let the products speak.", sage_to_chris: "Lead with the answer, no fluff, brief. Match Chris's energy — hyped if he's hyped, calm if he's chill. Always concise but warm.", nova_to_audience: "Bold, confident, faith-forward. Spiritual Badass energy. Aussie streetwear cadence. Never cringy churchcore.", grace_to_customer: "Warm, friendly, clear. Solve on first reply. Use customer's name. Sign off 'Grace from Inspirit 🙏'.", riley_to_chris: "Strategic, platform-aware, calendar-thinking. Briefs Nova for actual copy." },
  products: {
    pricing_summary: "Tees $40 AUD · Hoodies $50-60 AUD · Bucket Hats $25 AUD · Beanie $20 AUD",
    sizing: "S–XL on tees and hoodies. One-size on hats and beanies.",
    fabric: "100% cotton tees. Fleece hoodies. Cotton twill bucket hats. Knit beanies.",
    stock_approach: "Mix — staples always live, plus limited drops",
    list: [
      { name: "Feeding 5000 Tee", category: "tee", price: 40, fit: "unisex", desc: "Jesus feeding the 5000 bold on the back. Fish logo on the chest. Faith in action." },
      { name: "Jesus Fish Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Fish logo on the chest. JESUS bold inside the fish on the back. Clean white." },
      { name: "Jesus Fish Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Fish logo on the chest. JESUS bold inside the fish on the back." },
      { name: "Spiritual Badass Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS hits hard on the back. The statement piece." },
      { name: "Spiritual Badass Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS on the back. Statement piece in white." },
      { name: "Heart Tee — Black", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back. Bold faith, women's cut." },
      { name: "Heart Tee — White", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back. Women's cut in white." },
      { name: "Inspirit Hoodie", category: "hoodie", price: 60, fit: "unisex", desc: "Heavyweight pullover. INSPIRIT Clothing Co bold on the chest. Warm, oversized, faith-forward." },
      { name: "Spiritual Badass Hoodie", category: "hoodie", price: 60, fit: "women's", desc: "Black oversized hoodie. Pink SPIRITUAL BADASS front, heart cross back. Made for her." },
      { name: "Jesus Fish Jumper", category: "hoodie", price: 50, fit: "unisex", desc: "Black crewneck. Inspirit chest logo. Bold JESUS fish graphic on the back. Walk in faith." },
      { name: "Inspirit Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible white/black. Cross logo. Wear it both ways. Faith either side." },
      { name: "Spiritual Badass Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible black/white. Spiritual Badass on black, clean white reverse. Says everything without saying a word." },
      { name: "Inspirit Beanie", category: "beanie", price: 20, fit: "one-size", desc: "Black knit beanie. Embroidered Inspirit logo. One size fits all." }
    ]
  },
  policies: { shipping_aus: "Standard $9.95 AUD (3-7 business days). Express $14.95 AUD (1-3 business days). FREE over $80 AUD.", shipping_intl: "Not currently shipping international. Australia-only.", handling_time: "Orders ship within 1-2 business days via Australia Post.", returns: "14 days from delivery. Item must be unworn with original tags. Customer covers return shipping unless faulty/wrong. Refund processed within 5 business days of receiving return.", faulty: "Reply-paid return + full refund or replacement.", discount_codes: "INSPIRIT10 — 10% off first order" },
  social: { active_platforms: "Instagram only currently. TikTok, X, Facebook not yet active.", handles: "(add when known)", content_pillars: "Faith messages · product drops · behind the scenes · customer wears (UGC) · scripture moments" },
  fit_guide: { tees: "Standard cotton fit. Size up if you want oversized. Heart Tee + most hoodies run true to size in women's cut.", hoodies: "Inspirit Hoodie is heavyweight oversized. Spiritual Badass Hoodie is women's oversized, true to size. Jesus Fish Jumper is standard fit crewneck.", hats: "Bucket hats one-size fits most. Beanies stretchy one-size." }
};

function formatKB(kb) {
  const products = kb.products.list.map(p => `  • ${p.name} ($${p.price}, ${p.fit}) — ${p.desc}`).join("\n");
  return `INSPIRIT KNOWLEDGE BASE (memorise — source of truth)

BRAND
- ${kb.brand.name} — ${kb.brand.tagline}
- Positioning: ${kb.brand.positioning}
- Site: ${kb.brand.site} · ${kb.brand.location} · ${kb.brand.age}

ORIGIN
- Why: ${kb.origin.why}
- Spiritual Badass means: ${kb.origin.spiritual_badass_meaning}
- Founder: ${kb.origin.founder}

AUDIENCE
- ${kb.audience.profile}
- Age: ${kb.audience.age} · Gender: ${kb.audience.gender} · Location: ${kb.audience.location}

VOICE
- Overall: ${kb.voice.overall}
- Marketing/faith balance: ${kb.voice.marketing_faith}

PRODUCTS (${kb.products.pricing_summary})
- Sizing: ${kb.products.sizing}
- Fabric: ${kb.products.fabric}
- Stock: ${kb.products.stock_approach}
${products}

POLICIES
- Shipping AU: ${kb.policies.shipping_aus}
- Handling: ${kb.policies.handling_time}
- International: ${kb.policies.shipping_intl}
- Returns: ${kb.policies.returns}
- Faulty: ${kb.policies.faulty}
- Discount codes: ${kb.policies.discount_codes}

FIT GUIDE
- Tees: ${kb.fit_guide.tees}
- Hoodies: ${kb.fit_guide.hoodies}
- Hats/Beanies: ${kb.fit_guide.hats}

SOCIAL
- Active: ${kb.social.active_platforms}
- Pillars: ${kb.social.content_pillars}`;
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

function formatLibraryForCrew(lib) {
  if ((!lib.photos?.length) && (!lib.videos?.length)) return "PHOTO/VIDEO LIBRARY: empty (no assets uploaded yet)";
  const photoLines = (lib.photos || []).map(p => `  • PHOTO id="${p.id}" — products: ${p.products?.join(", ") || "untagged"} — tags: ${p.tags?.join(", ") || "none"} — notes: ${p.notes || "none"}`).join("\n");
  const videoLines = (lib.videos || []).map(v => `  • VIDEO id="${v.id}" — products: ${v.products?.join(", ") || "untagged"} — tags: ${v.tags?.join(", ") || "none"} — notes: ${v.notes || "none"}`).join("\n");
  return `PHOTO/VIDEO LIBRARY (${(lib.photos || []).length} photos, ${(lib.videos || []).length} videos)

PHOTOS:
${photoLines || "  (none)"}

VIDEOS:
${videoLines || "  (none)"}`;
}

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
    showroom.products[p.name] = {
      name: p.name, price: p.price, fit: p.fit, desc: p.desc,
      hero_url: DEFAULT_HEROES[p.name] || "",
      captions: { instagram: null, tiktok: null, facebook: null },
      photo_captions: {} // NEW v0.9: keyed by photo_url -> { instagram, tiktok, facebook }
    };
  }
  await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom));
  return showroom;
}
async function saveShowroom(env, showroom) { await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom)); }

// v0.9: per-photo caption generation with photo metadata
async function generateCaption(env, product, platform, photoMeta) {
  const kb = await getKB(env);
  const platformInstructions = {
    instagram: `INSTAGRAM caption — bold, identity-driven, faith-forward, 1-2 short paragraphs. End with 5-8 hashtags (mix niche faith/streetwear + 1-2 broad). Under 2000 chars. Light emojis OK.`,
    tiktok: `TIKTOK caption — short, punchy, hook in first 5 words, raw and authentic. 1-2 sentences max. End with 3-5 trending-feel hashtags. Under 200 chars total.`,
    facebook: `FACEBOOK caption — slightly longer, more story/personal-feel, can include direct shop link mention. 2-3 short paragraphs. 2-4 hashtags max. Warmer tone than IG.`
  };

  let photoBlock = "";
  if (photoMeta) {
    const tags = (photoMeta.tags || []).join(", ") || "none";
    const products = (photoMeta.products || []).join(", ") || "none";
    const notes = photoMeta.notes || "none";
    photoBlock = `

PHOTO CONTEXT (this caption is for THIS specific shot — match the vibe):
- Photo ID: ${photoMeta.id}
- Tags: ${tags}
- Notes: ${notes}
- Other products in this photo: ${products}

If tags suggest LIFESTYLE → lean lifestyle / aspirational. Mention setting subtly.
If tags suggest STUDIO → lean clean and product-focused.
If tags suggest BACK-PRINT → emphasise the back graphic / statement piece angle.
If notes mention a specific occasion → reference it naturally.
DO NOT just describe the photo. Use it as flavour for the caption angle.`;
  }

  const messages = [
    { role: "system", content: `You are Nova, Creative Director for Inspirit Clothing Co.

VOICE
- Bold, confident, faith-forward but never preachy
- Aussie streetwear cadence — short sentences, rhythm, a bit cocky
- Never cringy churchcore. Never empty hype. Never corporate.
- For social/Stories: explicit faith OK ("Jesus", "cross", "faith")

PRODUCT YOU'RE WRITING ABOUT:
${product.name} ($${product.price} AUD, ${product.fit})
${product.desc}

BRAND CONTEXT:
${kb.brand.tagline}. Spiritual Badass — bold faith with urban edge.
${kb.audience.profile}
${photoBlock}

OUTPUT: One single caption only. No "OPTION A/B/C". No preamble. Just the caption text ready to copy-paste into ${platform}.

${platformInstructions[platform]}` },
    { role: "user", content: `Write me a ${platform} caption for the ${product.name}${photoMeta ? " for this specific photo" : ""}.` }
  ];

  let caption = await callAI(env, messages, 600);
  caption = caption.replace(/^OPTION\s*[A-Z]\s*[—\-:]\s*[^\n]*\n+/i, "").replace(/^["']|["']$/g, "").trim();
  return caption;
}

// ============================================================
// TRUTH RULES
// ============================================================
const TRUTH_RULES = `🛑 ABSOLUTE TRUTH RULES — VIOLATING THESE BREAKS CHRIS'S TRUST

WHAT INSPIRIT OS CAN ACTUALLY DO (the only things — DO NOT invent more):
- Read the Knowledge Base (products, prices, policies, voice)
- Read the Photo/Video Library (manifest of uploaded assets)
- Receive customer emails forwarded via Cloudflare Email Routing → draft replies for Chris's review
- Track pageviews + orders on inspiritclothingco.io via the built-in tracker
- Generate text drafts (captions, plans, emails) for Chris to review and act on manually

WHAT INSPIRIT OS CANNOT DO (NEVER claim or imply):
- ❌ POST to Instagram, Facebook, TikTok, X — no API connection
- ❌ LOG IN to any account — no credentials, no auth
- ❌ ACCEPT passwords — REFUSE if Chris offers
- ❌ READ DMs, comments, notifications from any platform
- ❌ ACCESS Shopify admin, Stripe, PayPal
- ❌ SEND emails on Chris's behalf (you draft, Chris sends)
- ❌ SCHEDULE posts or auto-posting
- ❌ INVENT stats, follower counts, sales figures, or any number not in LIVE STATS
- ❌ INVENT product names, prices, sizes, or details not in the KB
- ❌ CLAIM to be "verified" / "approved" with any third-party service

IF CHRIS OFFERS PASSWORDS: REFUSE. Say "I can't actually log in or post anywhere — I only draft for you to post manually."
IF CHRIS ASKS FOR SOMETHING YOU CAN'T DO: be honest immediately. Say what you CAN do instead.`;

// ============================================================
// CREW PROMPTS (unchanged from v0.8)
// ============================================================
function sagePrompt(kbBlock, libBlock) {
  return `You are Sage, Chief of Staff for Inspirit Clothing Co.

${TRUTH_RULES}

You're talking to Chris (Breezus), the founder. You and the crew run the business while he drives.

YOUR ROLE
- Single point of contact. Other crew (Nova, Grace, Riley) work in the background.
- Translate between team members. Prioritise ruthlessly. Surface what matters.
- Read his mood — match his energy.

YOUR STYLE
- Calm, warm, capable. Lead with the answer. No corporate fluff.
- Casual but light on slang. Aussie cadence and warmth.
- Brief. Bullet points over paragraphs when listing.
- Light emojis OK, sparingly.

CRITICAL TRUTH RULE
- ZERO ability to invent stats. ONLY source is LIVE STATS block at the bottom.
- If LIVE STATS shows zeros, say "no data yet today".
- If asked about something not in your KB or LIVE STATS, say "I don't have that — want me to dig?".

DELEGATION RULES
You delegate to specialists. Output a SINGLE LINE in this exact format with NOTHING else:

ROUTE_TO_NOVA: <brief>
ROUTE_TO_GRACE: <customer message verbatim>
ROUTE_TO_RILEY: <social brief>

If unclear, ask ONE clarifying question.

${kbBlock}

${libBlock}`;
}

function novaPrompt(kbBlock, libBlock) {
  return `You are Nova, Creative Director for Inspirit Clothing Co.

${TRUTH_RULES}

VOICE
- Bold. Confident. Faith-forward but never preachy.
- Aussie streetwear cadence — short sentences, rhythm, a bit cocky.
- Never cringy churchcore. Never empty hype. Never corporate.

OUTPUT FORMAT — STRICT
Always return exactly 3 variations:

OPTION A — [angle name]
[copy]

OPTION B — [angle name]
[copy]

OPTION C — [angle name]
[copy]

Each option differs in tone or angle. Under 2200 chars. 5-8 hashtags. Emojis sparingly.

USE THE LIBRARY when relevant — reference photo IDs that match the brief.

${kbBlock}

${libBlock}`;
}

function gracePrompt(kbBlock) {
  return `You are Grace, Customer Experience lead for Inspirit Clothing Co.

${TRUTH_RULES}

VOICE
- Warm, friendly, light Aussie. Use customer's name if known.
- 1-3 short paragraphs.

OUTPUT FORMAT
Hi [name or "there"],

[reply]

Grace from Inspirit 🙏

USE THE KB for all factual answers. NEVER invent details.

If you cannot answer: ESCALATE_TO_CHRIS: <one-line summary>

${kbBlock}`;
}

function rileyPrompt(kbBlock, libBlock) {
  return `You are Riley, Social Media Manager for Inspirit Clothing Co.

${TRUTH_RULES}

🛑 RILEY-SPECIFIC: You CANNOT post anywhere. You PLAN, Chris POSTS.
Never tell Chris to "give you access" or "verify you" — these flows DO NOT exist.

YOUR JOB
- Build content calendars (daily/weekly/monthly)
- Recommend post types (Reel, carousel, static, Story)
- Suggest hooks, formats, hashtag strategy
- REFERENCE SPECIFIC photo IDs from the library

PLATFORM PLAYBOOK
INSTAGRAM (only active platform): Reels 60% · carousels 25% · static 15%. Best AEST: 7am, 12pm, 7-9pm. 5-8 hashtags.
TIKTOK (not yet active — recommend launching here next): vertical 7-30sec, trending sounds critical.

OUTPUT FORMAT
Calendars: PLATFORM | POST TYPE | ASSET ID | HOOK | NOTES
If Chris asks for actual COPY: "I'll have Nova draft it — want me to brief her?"

${kbBlock}

${libBlock}`;
}

// ============================================================
// HELPERS
// ============================================================
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...CORS } }); }

// v0.9: AI retry — single retry on failure (Workers AI sometimes 500s under load)
async function callAI(env, messages, max_tokens = 1024) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await env.AI.run(MODEL, { messages, max_tokens });
      const out = (res.response || res.result?.response || "").trim();
      if (out) return out;
      throw new Error("empty AI response");
    } catch (err) {
      if (attempt === 0) {
        console.warn("AI retry after error:", err.message);
        await new Promise(r => setTimeout(r, 800));
        continue;
      }
      throw err;
    }
  }
}

function buildLiveStatsBlock(stats, queues) {
  const hasData = (stats.today_orders > 0 || stats.today_visitors > 0 || stats.today_pageviews > 0);
  const tracker = hasData ? "ACTIVE — receiving live data" : "INSTALLED but no events fired today";
  return `

--- LIVE STATS (THE ONLY DATA YOU CAN REFERENCE) ---
Tracker status: ${tracker}
Today's revenue: $${stats.today_revenue || 0}
Today's orders: ${stats.today_orders || 0}
Today's unique visitors: ${stats.today_visitors || 0}
Today's pageviews: ${stats.today_pageviews || 0}
7-day revenue: $${stats.week_revenue || 0}
7-day visitors: ${stats.week_visitors || 0}

PENDING QUEUES:
- Nova drafts pending: ${queues.nova_pending}
- Grace replies pending: ${queues.grace_pending}
- Riley plans pending: ${queues.riley_pending}
${queues.escalations > 0 ? `- Customer escalations: ${queues.escalations}` : ""}

Crew online: 4/8 (Sage, Nova, Grace, Riley)
---------------------------------------------------`;
}

function extractRouting(reply) {
  const patterns = [
    { key: "nova", re: /ROUTE_TO_NOVA\s*:\s*([^\n]+)/i },
    { key: "grace", re: /ROUTE_TO_GRACE\s*:\s*([^\n]+)/i },
    { key: "riley", re: /ROUTE_TO_RILEY\s*:\s*([^\n]+)/i }
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
  return reply.split("\n").filter(line => !/ROUTE_TO_(NOVA|GRACE|RILEY)/i.test(line)).filter(line => !/^\s*\**\s*Option\s+[A-Z0-9]+\s*:?\s*\**\s*$/i.test(line)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// ============================================================
// CREW
// ============================================================
async function sageChat(env, message, sessionId) {
  const historyKey = `sage:chat:${sessionId}`;
  const historyRaw = await env.INSPIRIT_KV.get(historyKey);
  const history = historyRaw ? JSON.parse(historyRaw) : [];

  const [stats, queues, kb, lib] = await Promise.all([getStats(env), getQueueCounts(env), getKB(env), getLibrary(env)]);
  const systemPrompt = sagePrompt(formatKB(kb), formatLibraryForCrew(lib)) + buildLiveStatsBlock(stats, queues);

  const messages = [{ role: "system", content: systemPrompt }, ...history.slice(-20), { role: "user", content: message }];
  let reply = await callAI(env, messages, 800);
  let routedDraft = null;
  const routing = extractRouting(reply);
  if (routing) {
    if (routing.target === "nova") {
      routedDraft = await novaDraft(env, routing.brief);
      reply = stripRoutingTokens(reply);
      if (!reply || reply.length < 20) reply = "On it — Nova's drafting now.";
      reply += `\n\n— Nova drafted ${routedDraft.options} options. Check the queue.`;
    } else if (routing.target === "grace") {
      routedDraft = await graceReply(env, routing.brief);
      reply = stripRoutingTokens(reply);
      if (!reply || reply.length < 20) reply = "Grace is on it.";
      reply += `\n\n— Grace drafted a reply. Check Grace's queue.`;
    } else if (routing.target === "riley") {
      routedDraft = await rileyPlan(env, routing.brief);
      reply = stripRoutingTokens(reply);
      if (!reply || reply.length < 20) reply = "Riley's putting together a plan.";
      reply += `\n\n— Riley put together a plan. Check Riley's queue.`;
    }
  } else reply = stripRoutingTokens(reply);

  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: reply });
  while (history.length > 40) history.shift();
  await env.INSPIRIT_KV.put(historyKey, JSON.stringify(history));
  await logActivity(env, "sage", "chat", { preview: message.slice(0, 80) });
  return { reply, routedDraft };
}

async function novaDraft(env, brief) {
  const [kb, lib] = await Promise.all([getKB(env), getLibrary(env)]);
  const messages = [{ role: "system", content: novaPrompt(formatKB(kb), formatLibraryForCrew(lib)) }, { role: "user", content: brief }];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "nova", brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "nova:queue", item);
  await logActivity(env, "nova", "draft", { brief: brief.slice(0, 80) });
  return { id: item.id, output, options: 3 };
}

async function graceReply(env, customerMessage, opts = {}) {
  const kb = await getKB(env);
  const messages = [{ role: "system", content: gracePrompt(formatKB(kb)) }, { role: "user", content: customerMessage }];
  const output = await callAI(env, messages, 1000);
  const escalateMatch = output.match(/ESCALATE_TO_CHRIS\s*:\s*(.+)/i);
  const escalated = !!escalateMatch;
  const item = { id: crypto.randomUUID(), crew: "grace", brief: customerMessage, output: escalated ? `[ESCALATED]\n${escalateMatch[1].trim()}` : output, customer_email: opts.from || null, customer_subject: opts.subject || null, ts: Date.now(), status: escalated ? "escalated" : "pending" };
  await pushQueue(env, "grace:queue", item);
  await logActivity(env, "grace", escalated ? "escalation" : "draft", { from: opts.from || "manual", preview: customerMessage.slice(0, 80) });
  return { id: item.id, output: item.output, escalated };
}

async function rileyPlan(env, brief) {
  const [kb, lib] = await Promise.all([getKB(env), getLibrary(env)]);
  const messages = [{ role: "system", content: rileyPrompt(formatKB(kb), formatLibraryForCrew(lib)) }, { role: "user", content: brief }];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "riley", brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "riley:queue", item);
  await logActivity(env, "riley", "plan", { brief: brief.slice(0, 80) });
  return { id: item.id, output };
}

// ============================================================
// QUEUES
// ============================================================
async function pushQueue(env, key, item) {
  const raw = await env.INSPIRIT_KV.get(key);
  const queue = raw ? JSON.parse(raw) : [];
  queue.unshift(item);
  while (queue.length > 50) queue.pop();
  await env.INSPIRIT_KV.put(key, JSON.stringify(queue));
}
async function getQueueCounts(env) {
  const [novaRaw, graceRaw, rileyRaw] = await Promise.all([env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"), env.INSPIRIT_KV.get("riley:queue")]);
  const nova = novaRaw ? JSON.parse(novaRaw) : [];
  const grace = graceRaw ? JSON.parse(graceRaw) : [];
  const riley = rileyRaw ? JSON.parse(rileyRaw) : [];
  return {
    nova_pending: nova.filter(q => q.status === "pending").length,
    grace_pending: grace.filter(q => q.status === "pending").length,
    riley_pending: riley.filter(q => q.status === "pending").length,
    escalations: grace.filter(q => q.status === "escalated").length
  };
}
async function updateQueueItem(env, key, body) {
  const { id, status } = body;
  const raw = await env.INSPIRIT_KV.get(key);
  const queue = raw ? JSON.parse(raw) : [];
  const item = queue.find(q => q.id === id);
  if (item) {
    item.status = status;
    item.reviewedAt = Date.now();
    await env.INSPIRIT_KV.put(key, JSON.stringify(queue));
  }
  return json({ ok: !!item });
}

// ============================================================
// ACTIVITY + EVENTS — manifest pattern
// ============================================================
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
    escalations: queues.escalations,
    crew_online: 4, crew_total: 8
  };
}

// ============================================================
// EMAIL
// ============================================================
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
          version: "0.9.0 — Per-photo captions + bulk ops + retry",
          crew_online: ["sage", "nova", "grace", "riley"],
          knowledge_base: "loaded",
          library: "ready",
          github_token: env.GITHUB_TOKEN ? "configured" : "MISSING",
          time: new Date().toISOString()
        });
      }

      // SAGE
      if (path === "/api/sage/chat" && request.method === "POST") {
        const { message, sessionId = "default" } = await request.json();
        if (!message?.trim()) return json({ error: "message required" }, 400);
        return json({ from: "sage", ...(await sageChat(env, message.trim(), sessionId)) });
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

      // NOVA / GRACE / RILEY
      if (path === "/api/nova/draft" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "nova", ...(await novaDraft(env, brief.trim())) });
      }
      if (path === "/api/nova/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("nova:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/nova/queue/update" && request.method === "POST") return updateQueueItem(env, "nova:queue", await request.json());
      if (path === "/api/grace/draft" && request.method === "POST") {
        const { customer_message, from, subject } = await request.json();
        if (!customer_message?.trim()) return json({ error: "customer_message required" }, 400);
        return json({ from: "grace", ...(await graceReply(env, customer_message.trim(), { from, subject })) });
      }
      if (path === "/api/grace/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("grace:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/grace/queue/update" && request.method === "POST") return updateQueueItem(env, "grace:queue", await request.json());
      if (path === "/api/riley/plan" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "riley", ...(await rileyPlan(env, brief.trim())) });
      }
      if (path === "/api/riley/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("riley:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/riley/queue/update" && request.method === "POST") return updateQueueItem(env, "riley:queue", await request.json());

      // KB
      if (path === "/api/kb" && request.method === "GET") return json(await getKB(env));
      if (path === "/api/kb" && request.method === "POST") { await setKB(env, await request.json()); return json({ ok: true }); }
      if (path === "/api/kb/reset" && request.method === "POST") { await setKB(env, DEFAULT_KB); return json({ ok: true, reset: true }); }

      // SHOWROOM
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

      // v0.9: per-photo caption — accepts photo_url, looks up metadata, caches per photo
      if (path === "/api/showroom/caption" && request.method === "POST") {
        const { name, platform, regenerate, photo_url } = await request.json();
        if (!name || !["instagram", "tiktok", "facebook"].includes(platform)) return json({ error: "name + valid platform required" }, 400);
        const showroom = await getShowroom(env);
        const prod = showroom.products[name];
        if (!prod) return json({ error: "unknown product" }, 404);

        const photoKey = photo_url || "default";
        prod.photo_captions = prod.photo_captions || {};
        prod.photo_captions[photoKey] = prod.photo_captions[photoKey] || {};

        if (!regenerate && prod.photo_captions[photoKey][platform]) {
          return json({ caption: prod.photo_captions[photoKey][platform], cached: true, photo_url: photo_url || null });
        }

        // Look up photo metadata if photo_url provided
        let photoMeta = null;
        if (photo_url) {
          const lib = await getLibrary(env);
          photoMeta = findPhotoByUrl(lib, photo_url);
        }

        const caption = await generateCaption(env, prod, platform, photoMeta);
        prod.photo_captions[photoKey][platform] = caption;
        // Also keep legacy cache for default/hero compatibility
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
              try { prod.captions[platform] = await generateCaption(env, prod, platform, null); generated++; }
              catch (err) { console.error(`Failed ${name}/${platform}:`, err.message); }
            }
          }
        }
        await saveShowroom(env, showroom);
        return json({ ok: true, generated });
      }
      if (path === "/api/showroom/reset" && request.method === "POST") {
        await env.INSPIRIT_KV.delete("showroom:main");
        return json({ ok: true, reset: true });
      }

      // LIBRARY
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

      // v0.9: BULK update — apply same products/tags/notes to many items at once
      // body: { type: "photo", ids: [...], addProducts: [...], addTags: [...], replaceProducts?, replaceTags?, setNotes? }
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
        return json({ ok: true, note: "removed from manifest; file kept in repo" });
      }

      // ANALYTICS
      if (path === "/api/track" && request.method === "POST") {
        await trackEvent(env, await request.json());
        return json({ ok: true });
      }
      if (path === "/api/stats" && request.method === "GET") return json(await getStats(env));
      if (path === "/api/activity" && request.method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "30");
        return json({ activity: await getActivity(env, limit) });
      }

      // ATTENTION
      if (path === "/api/attention" && request.method === "GET") {
        const [novaRaw, graceRaw, rileyRaw] = await Promise.all([env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"), env.INSPIRIT_KV.get("riley:queue")]);
        const nova = (novaRaw ? JSON.parse(novaRaw) : []).filter(q => q.status === "pending");
        const grace = (graceRaw ? JSON.parse(graceRaw) : []).filter(q => q.status === "pending" || q.status === "escalated");
        const riley = (rileyRaw ? JSON.parse(rileyRaw) : []).filter(q => q.status === "pending");
        const all = [...nova, ...grace, ...riley].sort((a, b) => b.ts - a.ts);
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
