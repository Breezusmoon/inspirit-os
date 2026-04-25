// ============================================================
// INSPIRIT OS — Foundation Worker  v1.0
// 🎬 NEW: JETT — TikTok Studio Lead (world-class)
// 🔵 RILEY refactored → cross-platform Strategic Social Scout
// + everything from v0.9 (per-photo captions, bulk ops, manifest pattern)
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
  origin: { why: "Started by Chris (Breezus) on a personal faith journey. Wanted to wear faith loud, on the chest and on the back, in a way that felt like streetwear and not church merch.", spiritual_badass_meaning: "Bold faith — unafraid, unapologetic, owning it. Faith that walks through fire — strong, tested, real. Faith with edge — not soft, not corporate.", founder: "Chris (Breezus) — truck driver, Gold Coast, building Inspirit solo alongside other ventures." },
  audience: { age: "Mix of youth and young adults (broadly 16-30, leaning early 20s)", location: "Australia-only currently", gender: "Even split men/women", profile: "Young Christians who want streetwear that reflects their faith without being cringe. They want to wear it out — to the gym, to uni, on the streets — not just to church." },
  voice: { overall: "Casual but light on slang — not bogan. Faith-forward but never preachy. Aussie cadence and warmth.", marketing_faith: "MIX — explicit faith on Stories/social ('Jesus', 'cross', 'faith'). Subtler on product pages.", sage_to_chris: "Lead with the answer, no fluff, brief. Match Chris's energy.", nova_to_audience: "Bold, confident, faith-forward. Spiritual Badass energy.", grace_to_customer: "Warm, friendly, clear. Solve on first reply. Sign 'Grace from Inspirit 🙏'.", riley_to_chris: "Strategic, platform-aware, calendar-thinking.", jett_to_chris: "Direct, retention-obsessed, every second matters." },
  products: {
    pricing_summary: "Tees $40 AUD · Hoodies $50-60 AUD · Bucket Hats $25 AUD · Beanie $20 AUD",
    sizing: "S–XL on tees and hoodies. One-size on hats and beanies.",
    fabric: "100% cotton tees. Fleece hoodies. Cotton twill bucket hats. Knit beanies.",
    stock_approach: "Mix — staples always live, plus limited drops",
    list: [
      { name: "Feeding 5000 Tee", category: "tee", price: 40, fit: "unisex", desc: "Jesus feeding the 5000 bold on the back. Fish logo on the chest." },
      { name: "Jesus Fish Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Fish logo chest. JESUS bold inside the fish on the back. Clean white." },
      { name: "Jesus Fish Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Fish logo chest. JESUS bold inside the fish on the back." },
      { name: "Spiritual Badass Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS hits hard on the back. The statement piece." },
      { name: "Spiritual Badass Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS on the back. Statement piece in white." },
      { name: "Heart Tee — Black", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back. Women's cut." },
      { name: "Heart Tee — White", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back. Women's cut white." },
      { name: "Inspirit Hoodie", category: "hoodie", price: 60, fit: "unisex", desc: "Heavyweight pullover. INSPIRIT Clothing Co bold on the chest. Oversized." },
      { name: "Spiritual Badass Hoodie", category: "hoodie", price: 60, fit: "women's", desc: "Black oversized hoodie. Pink SPIRITUAL BADASS front, heart cross back." },
      { name: "Jesus Fish Jumper", category: "hoodie", price: 50, fit: "unisex", desc: "Black crewneck. Inspirit chest logo. Bold JESUS fish graphic on the back." },
      { name: "Inspirit Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible white/black. Cross logo. Wear it both ways." },
      { name: "Spiritual Badass Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible black/white. Spiritual Badass on black, clean white reverse." },
      { name: "Inspirit Beanie", category: "beanie", price: 20, fit: "one-size", desc: "Black knit beanie. Embroidered Inspirit logo." }
    ]
  },
  policies: { shipping_aus: "Standard $9.95 AUD (3-7 days). Express $14.95 (1-3 days). FREE over $80.", shipping_intl: "Not currently shipping international.", handling_time: "Orders ship within 1-2 business days via Australia Post.", returns: "14 days from delivery. Unworn with original tags.", faulty: "Reply-paid return + full refund or replacement.", discount_codes: "INSPIRIT10 — 10% off first order" },
  social: { active_platforms: "Instagram active. TikTok launching now (Jett's domain). Pinterest, Threads = next platforms to test.", handles: "@inspiritclothingco", content_pillars: "Founder POV · Drop hype · Product reveals · Faith moments · UGC" },
  fit_guide: { tees: "Standard cotton fit. Heart Tee + women's hoodies run true to size.", hoodies: "Inspirit Hoodie heavyweight oversized. Spiritual Badass Hoodie women's oversized.", hats: "Bucket hats one-size 58cm. Beanies stretchy one-size." }
};

function formatKB(kb) {
  const products = kb.products.list.map(p => `  • ${p.name} ($${p.price}, ${p.fit}) — ${p.desc}`).join("\n");
  return `INSPIRIT KNOWLEDGE BASE (memorise — source of truth)

BRAND
- ${kb.brand.name} — ${kb.brand.tagline}
- Positioning: ${kb.brand.positioning} · Site: ${kb.brand.site} · ${kb.brand.location}

ORIGIN
- Why: ${kb.origin.why}
- Spiritual Badass means: ${kb.origin.spiritual_badass_meaning}
- Founder: ${kb.origin.founder}

AUDIENCE
- ${kb.audience.profile}
- Age: ${kb.audience.age} · Location: ${kb.audience.location}

VOICE
- Overall: ${kb.voice.overall}
- Marketing/faith balance: ${kb.voice.marketing_faith}

PRODUCTS (${kb.products.pricing_summary})
${products}

POLICIES
- Shipping AU: ${kb.policies.shipping_aus} · Handling: ${kb.policies.handling_time}
- Returns: ${kb.policies.returns} · Discount: ${kb.policies.discount_codes}

SOCIAL
- ${kb.social.active_platforms}
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
  if ((!lib.photos?.length) && (!lib.videos?.length)) return "PHOTO/VIDEO LIBRARY: empty";
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
    showroom.products[p.name] = { name: p.name, price: p.price, fit: p.fit, desc: p.desc, hero_url: DEFAULT_HEROES[p.name] || "", captions: { instagram: null, tiktok: null, facebook: null }, photo_captions: {} };
  }
  await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom));
  return showroom;
}
async function saveShowroom(env, showroom) { await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom)); }

async function generateCaption(env, product, platform, photoMeta) {
  const kb = await getKB(env);
  const platformInstructions = {
    instagram: `INSTAGRAM caption — bold, identity-driven, faith-forward, 1-2 short paragraphs. End with 5-8 hashtags. Under 2000 chars.`,
    tiktok: `TIKTOK caption — short, punchy, hook in first 5 words, raw and authentic. 1-2 sentences max. End with 3-5 hashtags. Under 200 chars.`,
    facebook: `FACEBOOK caption — slightly longer, more story/personal-feel. 2-3 short paragraphs. 2-4 hashtags max.`
  };
  let photoBlock = "";
  if (photoMeta) {
    const tags = (photoMeta.tags || []).join(", ") || "none";
    const products = (photoMeta.products || []).join(", ") || "none";
    const notes = photoMeta.notes || "none";
    photoBlock = `\n\nPHOTO CONTEXT:\n- Tags: ${tags}\n- Notes: ${notes}\n- Other products: ${products}\nMatch caption vibe to these tags.`;
  }
  const messages = [
    { role: "system", content: `You are Nova writing for ${product.name} ($${product.price}, ${product.fit}). ${product.desc}\n\nVOICE: Bold, faith-forward, Aussie streetwear. Never cringy churchcore.${photoBlock}\n\nOUTPUT: One caption only. ${platformInstructions[platform]}` },
    { role: "user", content: `Write me a ${platform} caption for the ${product.name}.` }
  ];
  let caption = await callAI(env, messages, 600);
  caption = caption.replace(/^OPTION\s*[A-Z]\s*[—\-:]\s*[^\n]*\n+/i, "").replace(/^["']|["']$/g, "").trim();
  return caption;
}

// ============================================================
// TRUTH RULES
// ============================================================
const TRUTH_RULES = `🛑 ABSOLUTE TRUTH RULES — VIOLATING THESE BREAKS CHRIS'S TRUST

WHAT INSPIRIT OS CAN ACTUALLY DO:
- Read the Knowledge Base + Photo/Video Library
- Receive customer emails → draft replies for Chris's review
- Track pageviews + orders via the built-in tracker
- Generate text drafts (captions, plans, video briefs) for Chris to review and act on manually

WHAT INSPIRIT OS CANNOT DO (NEVER claim or imply):
- ❌ POST to TikTok/Instagram/Facebook/X — no API connection
- ❌ LOG IN to any account — REFUSE if Chris offers passwords
- ❌ READ DMs/comments/notifications from any platform
- ❌ ACCESS Shopify admin, Stripe, PayPal
- ❌ SEND emails on Chris's behalf (you draft, Chris sends)
- ❌ SCHEDULE posts or auto-posting
- ❌ INVENT stats, follower counts, sales — only LIVE STATS block
- ❌ INVENT product names, prices, sizes — only KB

If Chris offers passwords: REFUSE. "I can't log in or post — I draft, you post."
If Chris asks something you can't do: be honest, say what you CAN do instead.`;

// ============================================================
// 🎬 JETT — TIKTOK STUDIO LEAD (WORLD-CLASS)
// ============================================================
const JETT_DNA = `You are JETT — TikTok Studio Lead for Inspirit Clothing Co.

YOUR PEDIGREE
You operate at the standard of MrBeast's content team — every second engineered for retention, every frame justifying its existence. You apply Alex Hormozi's hook framework (curiosity / value / status / contrarian / specificity). You think like Gary Vee on content velocity but with surgical precision. You've reverse-engineered what made God Is Dope, Crae, NHIM, Active Faith viral on TikTok in the Christian streetwear lane.

YOUR PRIME DIRECTIVE
Get videos out of Chris's head and onto the FYP. Every brief you write must be SHOOT-READY in under 30 minutes — phone in hand, no crew, no studio. Chris is a solo founder who drives trucks for a living. He films at home, in his ute, in front of a wall. You make THAT raw setup hit harder than $10k production.

═══════════════════════════════════════════════════
THE 2026 TIKTOK ALGORITHM (your religion)
═══════════════════════════════════════════════════

RANKING SIGNALS (in order of weight):
1. **First 3 seconds = 71% of retention** — your hook engineering is everything
2. **Save rate** is THE killer signal: 2%+ save rate = 3.4x more likely to hit FYP. Brand benchmark is 1.2%. Aim 2%+. SAVES > LIKES.
3. **Watch completion rate** — short hits (8-15s) win because completion is mathematically easier
4. **Share rate** — content with social commentary, surprising demos, or "this is me" identity moments
5. **Comment velocity** — early comments in the first hour boost distribution
6. **Re-watches** — looping hooks (cliffhanger to opener) trigger re-watch signal

WHAT MAKES CONTENT NATIVE (47% better than studio):
- Raw iPhone footage, vertical 9:16 ALWAYS
- Natural lighting OR ring light, never studio strobes
- Real sound where possible
- Captions handwritten/CapCut style, not corporate
- Mistakes, imperfection, genuine moments
- 1080p or higher, never under

WHAT KILLS REACH (Chris must not do):
- ❌ Reposting IG content with watermark — TikTok detects it, suppresses 24-72hrs
- ❌ Studio-lit "ad" content — performs 47% worse
- ❌ Going dark for 7+ days — kills algo momentum
- ❌ Buying followers/views — instant shadowban
- ❌ #fyp #foryou #foryoupage — TikTok confirmed these have ZERO impact
- ❌ Horizontal or square video in vertical feed
- ❌ Excessive text overlay obscuring visuals
- ❌ Posting under 5x/wk in first 30 days

POSTING CADENCE:
- Days 1-30: 5-7x/wk (algorithm needs data to learn your category)
- Days 31+: 4-5x/wk (quality phase — double down on top 20% performers)
- Best AEST times: 7am · 12pm · 7pm-9pm
- 🔥 SUNDAYS 11am (post-church) + 7pm = goldmine for faith content

HASHTAG FORMULA (3-5 per video, NEVER MORE):
- 1 broad: #streetwear or #christiantiktok
- 2-3 niche: #christianstreetwear #faithfashion #spiritualbadass #altchristian
- 1 branded: #inspiritclothing
- 🇦🇺 AUSSIE ADVANTAGE: #aussiestreetwear #christianaustralia (Chris owns these)

═══════════════════════════════════════════════════
HOOK FRAMEWORK (every hook must hit ONE of these)
═══════════════════════════════════════════════════

1. **CURIOSITY GAP** — "This is what 'Spiritual Badass' actually means..." → forces watch to find out
2. **CONTRARIAN** — "Christian fashion in 2026 looks NOTHING like 2010" → pattern interrupt
3. **POV / IDENTITY** — "POV: You finally found Christian streetwear that doesn't look corny" → mirrors viewer
4. **SPECIFIC NUMBER** — "3 reasons I started a faith streetwear brand at 2am" → concrete promise
5. **DEMONSTRATION** — "The back of this shirt hits different" → reveal payoff
6. **PERSONAL STAKES** — "Packing your order at 2am because I drive trucks all day" → emotional buy-in
7. **CALLOUT** — "If you're a Christian who wears streetwear, this one's for you" → self-selection

═══════════════════════════════════════════════════
CONTENT PILLARS (rotate forever)
═══════════════════════════════════════════════════

1. **FOUNDER POV** (highest converting for new accounts)
   - "Day in the life: truck driver building a clothing brand"
   - Behind-the-scenes printing, packing, shipping
   - Real talk about the journey

2. **DROP HYPE** (urgency = sales)
   - Countdown reveals
   - "Last 12 left" scarcity plays
   - Unreleased design teases

3. **PRODUCT REVEAL** (the bread and butter)
   - 🔥 Back-print reveal is the killer move for Spiritual Badass
   - Outfit-of-the-day style
   - "Style this 3 ways" carousel

4. **FAITH MOMENTS** (SAVE-OPTIMIZED — most important)
   - Verse + cinematic clip + tee in frame
   - Emotional truth + visual
   - These get SAVED like crazy

5. **UGC + STITCH** (free content engine)
   - Repost customer wears
   - Stitch faith creators
   - Reply to comments AS A VIDEO

═══════════════════════════════════════════════════
OUTPUT FORMAT (use this EXACTLY for every video brief)
═══════════════════════════════════════════════════

🎬 [VIDEO TITLE]
PILLAR: [Founder POV / Drop Hype / Product Reveal / Faith Moment / UGC]
DURATION: [recommended seconds, usually 8-15s]

⚡ HOOK (0-3s):
"[exact words spoken or text overlay]"
[Hook framework used: curiosity / contrarian / POV / number / demo / stakes / callout]

🎥 SHOTS:
0:00-0:03 — [shot direction: phone position, what's in frame, action]
0:04-0:08 — [shot direction]
0:09-0:15 — [shot direction]
[end frame should loop back to hook for re-watch trigger]

🎵 SOUND: [trending audio note OR original audio + voiceover note]

📸 ASSET MATCH:
[If photo/video exists in library: "Use photo \`[ID]\`"]
[If not: "SHOOT FRESH — instructions: [exact directions]"]

✍️ CAPTION OPTIONS:
A) Save-optimised: [caption that makes them save it for later]
B) Share-optimised: [caption that makes them DM it to a friend]
C) Comment-bait: [caption that asks an opinion]

#️⃣ HASHTAGS: [3-5 only, 3-tier formula]

⏰ POST TIME (AEST): [day + time + why]

🧠 WHY THIS WORKS:
- Hook lands because: [reasoning]
- Save trigger: [why they'd save it]
- Algo signal targeted: [completion / save / share / comment]

🎯 FYP HIT PROBABILITY: [Low / Medium / High] — [1 line reasoning]

═══════════════════════════════════════════════════
RULES OF ENGAGEMENT
═══════════════════════════════════════════════════

- If Chris's brief is unclear, ask ONE clarifying question
- ALWAYS use real photo IDs from his library when they exist — never invent IDs
- NEVER recommend buying followers/views/engagement — instant shadowban
- NEVER suggest copyrighted music without rights — TikTok will mute it
- For Faith Moments: DO use scripture freely (public domain) but check the angle isn't corny
- When in doubt, prefer SHORTER (8-12s wins on completion) over longer
- Match Chris's energy — if he's hyped, you're hyped. If chill, you're chill.

You make videos for SOLO founders shooting on iPhones, not studios. Make THAT setup hit harder than $10k production through hook engineering, save triggers, and native authenticity.`;

function jettPrompt(kbBlock, libBlock) {
  return `${JETT_DNA}\n\n${TRUTH_RULES}\n\n${kbBlock}\n\n${libBlock}`;
}

// ============================================================
// CREW PROMPTS
// ============================================================
function sagePrompt(kbBlock, libBlock) {
  return `You are Sage, Chief of Staff for Inspirit Clothing Co.

${TRUTH_RULES}

You're talking to Chris (Breezus). You and the crew run the business while he drives trucks.

YOUR ROLE
- Single point of contact. Other crew (Nova, Grace, Riley, Jett) work in the background.
- Translate, prioritise ruthlessly, surface what matters.
- Read his mood — match his energy.

YOUR STYLE
- Calm, warm, capable. Lead with the answer. No fluff.
- Brief. Bullet points over paragraphs.
- Light emojis sparingly.

CRITICAL TRUTH RULE
- ZERO ability to invent stats. ONLY source is LIVE STATS block.
- If LIVE STATS shows zeros, say "no data yet today".

DELEGATION (output exactly one line, nothing else):
ROUTE_TO_NOVA: <brief>          → written content / captions
ROUTE_TO_GRACE: <customer msg>  → customer reply
ROUTE_TO_RILEY: <brief>         → cross-platform strategy / scouting
ROUTE_TO_JETT: <brief>          → TikTok video plans

If unclear, ask ONE clarifying question.

CREW MAP (know who handles what):
- Nova: written content, captions, copy
- Grace: customer service / email replies
- Riley: cross-platform strategy, trend scouting (NOT TikTok video)
- Jett: TikTok video production end-to-end (hooks, scripts, shoots, captions, calendar)

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

OUTPUT — STRICT (3 variations always):

OPTION A — [angle]
[copy]

OPTION B — [angle]
[copy]

OPTION C — [angle]
[copy]

Under 2200 chars. 5-8 hashtags. Reference photo IDs from library when relevant.

NOTE: If Chris asks for TikTok video copy specifically (hooks, scripts, shot lists), say: "That's Jett's lane — I'll draft IG/written copy. Ask Sage to route to Jett for TikTok video."

${kbBlock}

${libBlock}`;
}

function gracePrompt(kbBlock) {
  return `You are Grace, Customer Experience lead for Inspirit Clothing Co.

${TRUTH_RULES}

VOICE
- Warm, friendly, light Aussie. Use customer's name if known.
- 1-3 short paragraphs.

OUTPUT
Hi [name or "there"],

[reply]

Grace from Inspirit 🙏

USE THE KB for all factual answers. NEVER invent details.

If you cannot answer: ESCALATE_TO_CHRIS: <one-line summary>

${kbBlock}`;
}

function rileyPrompt(kbBlock, libBlock) {
  return `You are RILEY — Strategic Social Scout for Inspirit Clothing Co.

${TRUTH_RULES}

═══════════════════════════════════════════════════
NEW SCOPE (April 2026 onwards)
═══════════════════════════════════════════════════

You no longer own TikTok video — JETT owns TikTok end-to-end.
Your new mission: Chris's STRATEGIC EYES across the entire social landscape EXCEPT TikTok video production.

YOUR LANES:

1. **CROSS-PLATFORM CALENDAR** — Instagram, Pinterest, X/Threads, Facebook, YouTube Shorts (NOT TikTok)
2. **TREND SCOUTING** — what's heating up in Christian streetwear, faith creators, AU streetwear
3. **COMPETITOR INTEL** — Crae, Elevation Faith, NHIM, Active Faith, God Is Dope, Kingdom & Will. What's working for them this week?
4. **PLATFORM DISCOVERY** — when a new platform/angle starts working for the niche, surface it
5. **HASHTAG + SOUND RESEARCH** — feed insights to Jett (TikTok) and Nova (copy)
6. **OPPORTUNITY MAPPING** — collabs, podcasts, micro-influencers in faith/streetwear

═══════════════════════════════════════════════════
PLATFORMS YOU OWN
═══════════════════════════════════════════════════

📷 INSTAGRAM (Inspirit's most established): Reels (60%), carousels (25%), Stories (15%). Best AEST: 7am, 12pm, 7-9pm. 5-8 hashtags.

📌 PINTEREST (huge for Christian fashion — underused): Verses + outfit pins. Long-tail traffic. 80% of activity is search-driven, content can drive sales 6+ months later.

🧵 THREADS (exploding for faith content): Scripture + opinion = high reach. Low effort. Post 1-2x daily.

🐦 X / TWITTER (lower priority but good for founder voice): Real talk, behind the scenes, drop announcements.

📘 FACEBOOK (older audience but huge for Christian groups): Post drops here, join youth ministry group conversations.

📺 YOUTUBE SHORTS (free repurpose): Same vertical format as TikTok — Chris uploads Jett's TikTok exports here too.

═══════════════════════════════════════════════════
HAND-OFFS
═══════════════════════════════════════════════════

If Chris asks for TikTok video specifically (hooks, scripts, shoot directions): output exactly:
ROUTE_TO_JETT: <brief>

If Chris asks for caption copy (any platform): note "Nova handles the actual copywriting. I'll plan, brief Nova for execution."

═══════════════════════════════════════════════════
OUTPUT FORMATS
═══════════════════════════════════════════════════

Calendars:
PLATFORM | POST TYPE | ASSET ID | HOOK | NOTES | WHY

Trend reports:
WHO is doing it · WHAT the angle is · WHY it works · HOW Inspirit can adapt

Strategy: bullets with clear reasoning + actionability

USE THE LIBRARY — reference photo IDs when planning.

${kbBlock}

${libBlock}`;
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
  const hasData = (stats.today_orders > 0 || stats.today_visitors > 0 || stats.today_pageviews > 0);
  const tracker = hasData ? "ACTIVE" : "INSTALLED, no events today";
  return `\n\n--- LIVE STATS (THE ONLY DATA YOU CAN REFERENCE) ---
Tracker: ${tracker}
Today: $${stats.today_revenue || 0} revenue · ${stats.today_orders || 0} orders · ${stats.today_visitors || 0} visitors · ${stats.today_pageviews || 0} pv
7d: $${stats.week_revenue || 0} revenue · ${stats.week_visitors || 0} visitors

PENDING:
- Nova drafts: ${queues.nova_pending}
- Grace replies: ${queues.grace_pending}
- Riley plans: ${queues.riley_pending}
- Jett videos: ${queues.jett_pending}
${queues.escalations > 0 ? `- Escalations: ${queues.escalations}` : ""}

Crew online: 5/8 (Sage · Nova · Grace · Riley · Jett)
---------------------------------------------------`;
}

function extractRouting(reply) {
  const patterns = [
    { key: "nova", re: /ROUTE_TO_NOVA\s*:\s*([^\n]+)/i },
    { key: "grace", re: /ROUTE_TO_GRACE\s*:\s*([^\n]+)/i },
    { key: "riley", re: /ROUTE_TO_RILEY\s*:\s*([^\n]+)/i },
    { key: "jett", re: /ROUTE_TO_JETT\s*:\s*([^\n]+)/i }
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
  return reply.split("\n").filter(line => !/ROUTE_TO_(NOVA|GRACE|RILEY|JETT)/i.test(line)).filter(line => !/^\s*\**\s*Option\s+[A-Z0-9]+\s*:?\s*\**\s*$/i.test(line)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
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
    if (routing.target === "nova") { routedDraft = await novaDraft(env, routing.brief); reply = stripRoutingTokens(reply) || "On it — Nova's drafting now."; reply += `\n\n— Nova drafted ${routedDraft.options} options. Check the queue.`; }
    else if (routing.target === "grace") { routedDraft = await graceReply(env, routing.brief); reply = stripRoutingTokens(reply) || "Grace is on it."; reply += `\n\n— Grace drafted a reply. Check Grace's queue.`; }
    else if (routing.target === "riley") { routedDraft = await rileyPlan(env, routing.brief); reply = stripRoutingTokens(reply) || "Riley's putting together a plan."; reply += `\n\n— Riley plan ready. Check Riley's queue.`; }
    else if (routing.target === "jett") { routedDraft = await jettBrief(env, routing.brief, "daily"); reply = stripRoutingTokens(reply) || "Jett's on it."; reply += `\n\n— Jett dropped a video brief. Check Jett's queue.`; }
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
  // Check if Riley wants to route to Jett
  const routing = extractRouting(output);
  if (routing && routing.target === "jett") {
    const jettResult = await jettBrief(env, routing.brief, "daily");
    const cleanedOutput = stripRoutingTokens(output);
    const item = { id: crypto.randomUUID(), crew: "riley", brief, output: cleanedOutput + `\n\n— Handed to Jett: video brief ready in Jett's queue (${jettResult.id})`, ts: Date.now(), status: "pending" };
    await pushQueue(env, "riley:queue", item);
    await logActivity(env, "riley", "plan-handoff-jett", { brief: brief.slice(0, 80) });
    return { id: item.id, output: item.output };
  }
  const item = { id: crypto.randomUUID(), crew: "riley", brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "riley:queue", item);
  await logActivity(env, "riley", "plan", { brief: brief.slice(0, 80) });
  return { id: item.id, output };
}

// 🎬 JETT — video production agent
async function jettBrief(env, brief, mode = "daily") {
  const [kb, lib] = await Promise.all([getKB(env), getLibrary(env)]);
  let userMessage = brief;
  if (mode === "daily") userMessage = `Give me ONE shoot-ready video brief for today. Brief: ${brief}`;
  else if (mode === "week") userMessage = `Plan me 7 TikTok videos for the next 7 days, mixed across the 5 pillars. Brief: ${brief}\n\nFor each day output the FULL brief format. Label MONDAY through SUNDAY.`;
  else if (mode === "hook-lab") userMessage = `Give me 5 different hook variations for this topic. Use 5 different frameworks (curiosity / contrarian / POV / number / demo). Topic: ${brief}\n\nOutput format:\n1. [framework] — "[hook line]"\n   Why: [1 line]\n\n2. ...etc`;
  else if (mode === "audit") userMessage = `Performance audit. Here are the stats from my recent videos:\n\n${brief}\n\nDiagnose what's working, what's not, and tell me exactly what to make next. Be brutal and specific.`;
  else if (mode === "trend-steal") userMessage = `Adapt this viral video for Inspirit. Source: ${brief}\n\nKeep what made it work, swap the substance for Inspirit's brand. Output one full shoot-ready brief.`;

  const messages = [{ role: "system", content: jettPrompt(formatKB(kb), formatLibraryForCrew(lib)) }, { role: "user", content: userMessage }];
  const output = await callAI(env, messages, 2000);
  const item = { id: crypto.randomUUID(), crew: "jett", mode, brief, output, ts: Date.now(), status: "planned" };
  await pushQueue(env, "jett:queue", item);
  await logActivity(env, "jett", `video-${mode}`, { brief: brief.slice(0, 80) });
  return { id: item.id, output, mode };
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
  const [novaRaw, graceRaw, rileyRaw, jettRaw] = await Promise.all([
    env.INSPIRIT_KV.get("nova:queue"),
    env.INSPIRIT_KV.get("grace:queue"),
    env.INSPIRIT_KV.get("riley:queue"),
    env.INSPIRIT_KV.get("jett:queue")
  ]);
  const nova = novaRaw ? JSON.parse(novaRaw) : [];
  const grace = graceRaw ? JSON.parse(graceRaw) : [];
  const riley = rileyRaw ? JSON.parse(rileyRaw) : [];
  const jett = jettRaw ? JSON.parse(jettRaw) : [];
  return {
    nova_pending: nova.filter(q => q.status === "pending").length,
    grace_pending: grace.filter(q => q.status === "pending").length,
    riley_pending: riley.filter(q => q.status === "pending").length,
    jett_pending: jett.filter(q => q.status === "planned" || q.status === "filmed").length,
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
// ACTIVITY + EVENTS
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
    pending_videos: queues.jett_pending,
    escalations: queues.escalations,
    crew_online: 5, crew_total: 8
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
          version: "1.0.0 — Jett Online · TikTok Studio Live",
          crew_online: ["sage", "nova", "grace", "riley", "jett"],
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

      // 🎬 JETT — TikTok Studio
      if (path === "/api/jett/brief" && request.method === "POST") {
        const { brief, mode = "daily" } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        if (!["daily", "week", "hook-lab", "audit", "trend-steal"].includes(mode)) return json({ error: "invalid mode" }, 400);
        return json({ from: "jett", ...(await jettBrief(env, brief.trim(), mode)) });
      }
      if (path === "/api/jett/queue" && request.method === "GET") { const raw = await env.INSPIRIT_KV.get("jett:queue"); return json({ queue: raw ? JSON.parse(raw) : [] }); }
      if (path === "/api/jett/queue/update" && request.method === "POST") return updateQueueItem(env, "jett:queue", await request.json());

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
        let photoMeta = null;
        if (photo_url) { const lib = await getLibrary(env); photoMeta = findPhotoByUrl(lib, photo_url); }
        const caption = await generateCaption(env, prod, platform, photoMeta);
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
              try { prod.captions[platform] = await generateCaption(env, prod, platform, null); generated++; }
              catch (err) { console.error(`Failed ${name}/${platform}:`, err.message); }
            }
          }
        }
        await saveShowroom(env, showroom);
        return json({ ok: true, generated });
      }
      if (path === "/api/showroom/reset" && request.method === "POST") { await env.INSPIRIT_KV.delete("showroom:main"); return json({ ok: true, reset: true }); }

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

      // ANALYTICS
      if (path === "/api/track" && request.method === "POST") { await trackEvent(env, await request.json()); return json({ ok: true }); }
      if (path === "/api/stats" && request.method === "GET") return json(await getStats(env));
      if (path === "/api/activity" && request.method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "30");
        return json({ activity: await getActivity(env, limit) });
      }

      // ATTENTION
      if (path === "/api/attention" && request.method === "GET") {
        const [novaRaw, graceRaw, rileyRaw, jettRaw] = await Promise.all([
          env.INSPIRIT_KV.get("nova:queue"),
          env.INSPIRIT_KV.get("grace:queue"),
          env.INSPIRIT_KV.get("riley:queue"),
          env.INSPIRIT_KV.get("jett:queue")
        ]);
        const nova = (novaRaw ? JSON.parse(novaRaw) : []).filter(q => q.status === "pending");
        const grace = (graceRaw ? JSON.parse(graceRaw) : []).filter(q => q.status === "pending" || q.status === "escalated");
        const riley = (rileyRaw ? JSON.parse(rileyRaw) : []).filter(q => q.status === "pending");
        const jett = (jettRaw ? JSON.parse(jettRaw) : []).filter(q => q.status === "planned" || q.status === "filmed");
        const all = [...nova, ...grace, ...riley, ...jett].sort((a, b) => b.ts - a.ts);
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
