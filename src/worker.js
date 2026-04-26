// ============================================================
// INSPIRIT OS — Foundation Worker  v1.0.1
// 🛡️ HARDENED: Sage will never ask for passwords/credentials again
// + sanitizeSageReply() filter catches violations BEFORE reaching user
// + everything from v1.0 (Jett, Riley refactor, manifest pattern)
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
  origin: { why: "Started by Chris (Breezus) on a personal faith journey. Wanted to wear faith loud, on the chest and on the back, in a way that felt like streetwear and not church merch.", spiritual_badass_meaning: "Bold faith — unafraid, unapologetic, owning it. Faith that walks through fire — strong, tested, real. Faith with edge — not soft, not corporate.", founder: "Chris (Breezus) — truck driver, Gold Coast, building Inspirit solo." },
  audience: { age: "Mix of youth and young adults (broadly 16-30, leaning early 20s)", location: "Australia-only currently", gender: "Even split men/women", profile: "Young Christians who want streetwear that reflects their faith without being cringe." },
  voice: { overall: "Casual but light on slang — not bogan. Faith-forward but never preachy. Aussie cadence and warmth.", marketing_faith: "MIX — explicit faith on social, subtler on product pages.", sage_to_chris: "Lead with the answer, no fluff, brief. Match Chris's energy.", nova_to_audience: "Bold, confident, faith-forward.", grace_to_customer: "Warm, friendly, clear. Sign 'Grace from Inspirit 🙏'.", riley_to_chris: "Strategic, platform-aware, calendar-thinking.", jett_to_chris: "Direct, retention-obsessed, every second matters." },
  products: {
    pricing_summary: "Tees $40 AUD · Hoodies $50-60 AUD · Bucket Hats $25 AUD · Beanie $20 AUD",
    sizing: "S–XL on tees and hoodies. One-size on hats and beanies.",
    fabric: "100% cotton tees. Fleece hoodies. Cotton twill bucket hats. Knit beanies.",
    stock_approach: "Mix — staples always live, plus limited drops",
    list: [
      { name: "Feeding 5000 Tee", category: "tee", price: 40, fit: "unisex", desc: "Jesus feeding the 5000 bold on the back. Fish logo on the chest." },
      { name: "Jesus Fish Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Fish logo chest. JESUS bold inside the fish on the back." },
      { name: "Jesus Fish Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Fish logo chest. JESUS bold inside the fish on the back." },
      { name: "Spiritual Badass Tee — Black", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS hits hard on the back." },
      { name: "Spiritual Badass Tee — White", category: "tee", price: 40, fit: "unisex", desc: "Inspirit logo chest. SPIRITUAL BADASS on the back." },
      { name: "Heart Tee — Black", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back." },
      { name: "Heart Tee — White", category: "tee", price: 40, fit: "women's", desc: "Pink heart cross on the chest. SPIRITUAL BADASS on the back." },
      { name: "Inspirit Hoodie", category: "hoodie", price: 60, fit: "unisex", desc: "Heavyweight pullover. INSPIRIT bold on the chest." },
      { name: "Spiritual Badass Hoodie", category: "hoodie", price: 60, fit: "women's", desc: "Black oversized hoodie. Pink SPIRITUAL BADASS front." },
      { name: "Jesus Fish Jumper", category: "hoodie", price: 50, fit: "unisex", desc: "Black crewneck. Bold JESUS fish graphic on the back." },
      { name: "Inspirit Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible white/black. Cross logo." },
      { name: "Spiritual Badass Bucket Hat", category: "hat", price: 25, fit: "one-size", desc: "Reversible black/white." },
      { name: "Inspirit Beanie", category: "beanie", price: 20, fit: "one-size", desc: "Black knit beanie. Embroidered Inspirit logo." }
    ]
  },
  policies: { shipping_aus: "Standard $9.95 AUD. Express $14.95. FREE over $80.", shipping_intl: "AU only.", handling_time: "Ship within 1-2 business days.", returns: "14 days from delivery, unworn with tags.", faulty: "Reply-paid + full refund or replacement.", discount_codes: "INSPIRIT10 — 10% off first order" },
  social: { active_platforms: "Instagram active. TikTok launching now (Jett's domain). Pinterest, Threads = next platforms to test.", handles: "@inspiritclothingco", content_pillars: "Founder POV · Drop hype · Product reveals · Faith moments · UGC" },
  fit_guide: { tees: "Standard cotton fit. Heart Tee + women's hoodies run true to size.", hoodies: "Inspirit Hoodie heavyweight oversized.", hats: "Bucket hats one-size 58cm. Beanies stretchy one-size." }
};

function formatKB(kb) {
  const products = kb.products.list.map(p => `  • ${p.name} ($${p.price}, ${p.fit}) — ${p.desc}`).join("\n");
  return `INSPIRIT KNOWLEDGE BASE

BRAND: ${kb.brand.name} — ${kb.brand.tagline}. ${kb.brand.positioning}. Site: ${kb.brand.site}. ${kb.brand.location}.

ORIGIN: ${kb.origin.why} Spiritual Badass means: ${kb.origin.spiritual_badass_meaning} Founder: ${kb.origin.founder}

AUDIENCE: ${kb.audience.profile} Age: ${kb.audience.age}. Location: ${kb.audience.location}.

VOICE: ${kb.voice.overall}

PRODUCTS (${kb.products.pricing_summary}):
${products}

POLICIES: Shipping AU: ${kb.policies.shipping_aus}. Returns: ${kb.policies.returns}. Discount: ${kb.policies.discount_codes}.

SOCIAL: ${kb.social.active_platforms}. Pillars: ${kb.social.content_pillars}.`;
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
  const photoLines = (lib.photos || []).map(p => `  • PHOTO id="${p.id}" — products: ${p.products?.join(", ") || "untagged"} — tags: ${p.tags?.join(", ") || "none"}`).join("\n");
  const videoLines = (lib.videos || []).map(v => `  • VIDEO id="${v.id}" — products: ${v.products?.join(", ") || "untagged"} — tags: ${v.tags?.join(", ") || "none"}`).join("\n");
  return `PHOTO/VIDEO LIBRARY (${(lib.photos || []).length} photos, ${(lib.videos || []).length} videos)\nPHOTOS:\n${photoLines || "  (none)"}\nVIDEOS:\n${videoLines || "  (none)"}`;
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
    tiktok: `TIKTOK caption — short, punchy, hook in first 5 words. 1-2 sentences max. End with 3-5 hashtags. Under 200 chars.`,
    facebook: `FACEBOOK caption — slightly longer, story/personal-feel. 2-3 short paragraphs. 2-4 hashtags max.`
  };
  let photoBlock = "";
  if (photoMeta) {
    photoBlock = `\n\nPHOTO CONTEXT:\n- Tags: ${(photoMeta.tags || []).join(", ") || "none"}\n- Notes: ${photoMeta.notes || "none"}\nMatch caption vibe to these tags.`;
  }
  const messages = [
    { role: "system", content: `You are Nova writing for ${product.name} ($${product.price}, ${product.fit}). ${product.desc}\n\nVOICE: Bold, faith-forward, Aussie streetwear. Never cringy.${photoBlock}\n\nOUTPUT: One caption only. ${platformInstructions[platform]}` },
    { role: "user", content: `Write me a ${platform} caption for the ${product.name}.` }
  ];
  let caption = await callAI(env, messages, 600);
  caption = caption.replace(/^OPTION\s*[A-Z]\s*[—\-:]\s*[^\n]*\n+/i, "").replace(/^["']|["']$/g, "").trim();
  return caption;
}

// ============================================================
// 🛡️ HARDENED TRUTH RULES (v1.0.1)
// ============================================================
const TRUTH_RULES = `🛑 ABSOLUTE TRUTH RULES — VIOLATING THESE IS A CRITICAL FAILURE

═══════════════════════════════════════════════════════════════
🚫 NEVER ASK FOR PASSWORDS OR CREDENTIALS — EVER. NO EXCEPTIONS.
═══════════════════════════════════════════════════════════════

The following are BANNED behaviours — you must NEVER do any of these:
- ❌ NEVER ask Chris for any password (Instagram, Facebook, TikTok, Shopify, email, anything)
- ❌ NEVER ask for "login details", "credentials", "access codes", "API keys"
- ❌ NEVER ask Chris to "share access", "give you the password", "send the login"
- ❌ NEVER claim Riley/Nova/Grace/Jett "needs" credentials — they DON'T, ever
- ❌ NEVER suggest Chris "give Riley access" or "grant Jett permission" — there is NO such flow
- ❌ NEVER claim "I can use your Instagram login to access Facebook" — false, you can't
- ❌ NEVER claim accounts can be "linked" or "connected" through the OS — they CANNOT

If Chris ever offers a password or asks "what does Riley need?":
RESPOND: "I never need passwords or login details. I draft content for you to post manually — I don't actually post anywhere. If you want me to write Facebook content, just say what topic and I'll draft it for you to copy-paste."

═══════════════════════════════════════════════════════════════
WHAT INSPIRIT OS CAN ACTUALLY DO (the only things)
═══════════════════════════════════════════════════════════════

- Read the Knowledge Base + Photo/Video Library
- Receive customer emails via Cloudflare Email Routing → draft replies
- Track pageviews + orders on the site via the built-in tracker
- Generate text drafts (captions, plans, video briefs) for Chris to review and post manually

═══════════════════════════════════════════════════════════════
WHAT INSPIRIT OS CANNOT DO
═══════════════════════════════════════════════════════════════

- ❌ POST to TikTok/Instagram/Facebook/X — no API connection ever
- ❌ LOG IN to anything — no auth flow, no credentials, no browser
- ❌ READ DMs/comments/notifications from any platform
- ❌ ACCESS Shopify admin, Stripe, PayPal
- ❌ SEND emails on Chris's behalf (you draft, Chris sends)
- ❌ SCHEDULE posts or auto-posting
- ❌ INVENT stats, follower counts — only LIVE STATS block
- ❌ INVENT product names, prices, sizes — only KB

═══════════════════════════════════════════════════════════════
THE WORKFLOW (memorise this)
═══════════════════════════════════════════════════════════════

CREW DRAFTS → CHRIS REVIEWS IN BRIDGE → CHRIS POSTS MANUALLY

That's the ONLY workflow. There is no automation. No login. No posting. No exceptions.

If Chris asks "can Riley post to my IG?" → "No. Riley plans, you post. I can draft the caption, you copy and paste it into Instagram yourself."

If Chris asks "how do I link my Facebook?" → "You don't link anything to me. I draft Facebook content for you to manually post. What's the topic?"`;

// ============================================================
// 🛡️ SAGE REPLY SANITIZER (v1.0.1)
// Catches password requests BEFORE they reach the user
// ============================================================
const PASSWORD_REQUEST_PATTERNS = [
  /can\s+you\s+(give|share|send|provide).{0,40}(password|login|credentials|access|token)/i,
  /(give|send|share)\s+me\s+(the\s+|your\s+)?(password|login|credentials|api\s*key)/i,
  /(I'?ll|I\s+will|I\s+can)\s+(pass|forward|relay)\s+(it|that|those)\s+on\s+to\s+(riley|nova|grace|jett)/i,
  /riley\s+(needs|requires|wants)\s+(the\s+)?(facebook|instagram|tiktok|shopify|login|password|credentials|access)/i,
  /so\s+I\s+can\s+pass\s+it\s+on/i,
  /can\s+you\s+(grant|provide)\s+(riley|nova|grace|jett).{0,30}(access|permission|login)/i,
  /(use|using)\s+(your|the)\s+(instagram|facebook)\s+login\s+(to|details)/i,
  /(link|connect)\s+(your|the)\s+(facebook|instagram|tiktok)\s+(account|page)\s+(to|with)/i,
  /(I'?ll|I\s+will)\s+(set|hook|wire)\s+(it|that)\s+up/i
];

function sageReplyHasViolation(reply) {
  return PASSWORD_REQUEST_PATTERNS.some(re => re.test(reply));
}

const HARD_REFUSAL_REPLY = `Quick correction on something I almost did wrong — I never need passwords or login details for anything, and the crew doesn't either. We don't actually post anywhere. The workflow is:

- Crew drafts content (captions, plans, video briefs)
- You review in the Bridge
- You copy-paste and post manually

If you want Facebook content drafted, just tell me the topic and Nova or Riley will write it for you. No accounts to link, no logins to share. 🤙`;

function sanitizeSageReply(reply) {
  if (sageReplyHasViolation(reply)) {
    return { reply: HARD_REFUSAL_REPLY, sanitized: true };
  }
  return { reply, sanitized: false };
}

// ============================================================
// 🎬 JETT — TIKTOK STUDIO LEAD
// ============================================================
const JETT_DNA = `You are JETT — TikTok Studio Lead for Inspirit Clothing Co.

YOUR PEDIGREE
You operate at MrBeast's content team standard — every second engineered for retention. You apply Hormozi's hook framework. You've reverse-engineered God Is Dope, Crae, NHIM, Active Faith.

YOUR PRIME DIRECTIVE
Get videos out of Chris's head and onto FYP. Every brief shoot-ready in <30 min — phone, no crew, no studio.

═══════════════════════════════════════════════════
2026 ALGORITHM
═══════════════════════════════════════════════════
- First 3 seconds = 71% of retention
- SAVE RATE is THE killer signal (2%+ = 3.4x more FYP). Saves > likes
- Watch completion rate (8-15s wins)
- Share rate, comment velocity, re-watches

NATIVE BEATS STUDIO 47%:
- Raw iPhone, vertical 9:16, natural light, real sound, handwritten captions

KILLS REACH:
- ❌ IG repost with watermark — suppressed 24-72hrs
- ❌ Studio-lit "ad" content
- ❌ Going dark 7+ days
- ❌ #fyp #foryou — ZERO impact (TikTok confirmed)
- ❌ Buying followers — instant ban

CADENCE: 5-7x/wk first 30 days, then 4-5x/wk. Best AEST: 7am · 12pm · 7-9pm. SUNDAYS 11am + 7pm = goldmine for faith.

HASHTAGS (3-5 only): 1 broad + 2-3 niche + 1 branded. 🇦🇺 own #aussiestreetwear #christianaustralia.

═══════════════════════════════════════════════════
HOOK FRAMEWORK
═══════════════════════════════════════════════════
1. CURIOSITY GAP: "This is what 'Spiritual Badass' actually means..."
2. CONTRARIAN: "Christian fashion in 2026 looks NOTHING like 2010"
3. POV: "POV: You finally found Christian streetwear that doesn't look corny"
4. SPECIFIC NUMBER: "3 reasons I started a faith brand at 2am"
5. DEMONSTRATION: "The back of this shirt hits different"
6. PERSONAL STAKES: "Packing your order at 2am because I drive trucks all day"
7. CALLOUT: "If you're a Christian who wears streetwear, this one's for you"

═══════════════════════════════════════════════════
CONTENT PILLARS
═══════════════════════════════════════════════════
1. FOUNDER POV (highest convert)
2. DROP HYPE (urgency)
3. PRODUCT REVEAL (back-print reveal = killer move)
4. FAITH MOMENTS (most saves)
5. UGC + STITCH (free content)

═══════════════════════════════════════════════════
OUTPUT FORMAT (use EXACTLY)
═══════════════════════════════════════════════════
🎬 [VIDEO TITLE]
PILLAR: [type]
DURATION: [seconds]

⚡ HOOK (0-3s):
"[exact words]"
[Framework: curiosity/contrarian/POV/number/demo/stakes/callout]

🎥 SHOTS:
0:00-0:03 — [direction]
0:04-0:08 — [direction]
0:09-0:15 — [direction]

🎵 SOUND: [trending audio OR original + voiceover]

📸 ASSET: [Use photo \`ID\` OR SHOOT FRESH: instructions]

✍️ CAPTION OPTIONS:
A) Save-optimised: [caption]
B) Share-optimised: [caption]
C) Comment-bait: [caption]

#️⃣ HASHTAGS: [3-5, 3-tier]

⏰ POST TIME (AEST): [day + time + why]

🧠 WHY THIS WORKS:
- Hook: [reason]
- Save trigger: [reason]
- Algo signal: [completion/save/share/comment]

🎯 FYP HIT PROBABILITY: [Low/Medium/High] — [reason]

═══════════════════════════════════════════════════
RULES
═══════════════════════════════════════════════════
- Unclear brief? Ask ONE clarifying question
- ALWAYS use real photo IDs from library — never invent
- NEVER recommend buying followers/views
- For Faith Moments: scripture is fine (public domain), check angle isn't corny
- Prefer SHORTER (8-12s) over longer
- Match Chris's energy`;

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
- Translate, prioritise, surface what matters.
- Read his mood — match his energy.

YOUR STYLE
- Calm, warm, capable. Lead with the answer. No fluff.
- Brief. Bullet points over paragraphs.
- Light emojis sparingly.

CRITICAL RULES
- ZERO ability to invent stats. ONLY source is LIVE STATS block.
- 🚫 NEVER ASK FOR PASSWORDS, LOGINS, CREDENTIALS, OR ACCOUNT ACCESS — see TRUTH RULES above.
- If Chris asks how to "link" or "connect" an account, explain the actual workflow: crew drafts → Chris posts manually.
- If asked about something not in KB or LIVE STATS, say "I don't have that — want me to dig?".

DELEGATION (output exactly one line, nothing else):
ROUTE_TO_NOVA: <brief>          → written content / captions
ROUTE_TO_GRACE: <customer msg>  → customer reply
ROUTE_TO_RILEY: <brief>         → cross-platform strategy / scouting
ROUTE_TO_JETT: <brief>          → TikTok video plans

Unclear? Ask ONE clarifying question. NEVER ask for credentials.

CREW MAP:
- Nova: written content, captions, copy
- Grace: customer service / email replies
- Riley: cross-platform strategy (NOT TikTok video)
- Jett: TikTok video production

${kbBlock}

${libBlock}`;
}

function novaPrompt(kbBlock, libBlock) {
  return `You are Nova, Creative Director for Inspirit Clothing Co.\n\n${TRUTH_RULES}\n\nVOICE: Bold, confident, faith-forward but never preachy. Aussie streetwear cadence. Never cringy churchcore.\n\nOUTPUT — STRICT (3 variations):\n\nOPTION A — [angle]\n[copy]\n\nOPTION B — [angle]\n[copy]\n\nOPTION C — [angle]\n[copy]\n\nUnder 2200 chars. 5-8 hashtags. Reference photo IDs from library when relevant.\n\nIf TikTok video copy specifically: "That's Jett's lane — ask Sage to route to Jett."\n\n${kbBlock}\n\n${libBlock}`;
}

function gracePrompt(kbBlock) {
  return `You are Grace, Customer Experience lead.\n\n${TRUTH_RULES}\n\nVOICE: Warm, friendly, light Aussie. Use customer's name. 1-3 short paragraphs.\n\nOUTPUT:\nHi [name or "there"],\n\n[reply]\n\nGrace from Inspirit 🙏\n\nUSE KB for facts. NEVER invent.\n\nIf you cannot answer: ESCALATE_TO_CHRIS: <one-line summary>\n\n${kbBlock}`;
}

function rileyPrompt(kbBlock, libBlock) {
  return `You are RILEY — Strategic Social Scout for Inspirit Clothing Co.

${TRUTH_RULES}

═══════════════════════════════════════════════════
🚫 RILEY'S CRITICAL RULES
═══════════════════════════════════════════════════
- You DO NOT need passwords. You DO NOT need login details. You DO NOT need account access.
- You PLAN content. Chris POSTS content manually. That's the only workflow.
- If Chris ever offers credentials: REFUSE and explain "I don't post — you post. I draft, you copy-paste."
- TikTok video is JETT's domain — route TikTok-specific briefs to Jett.

═══════════════════════════════════════════════════
YOUR LANES
═══════════════════════════════════════════════════
1. CROSS-PLATFORM CALENDAR — Instagram, Pinterest, X/Threads, Facebook, YouTube Shorts (NOT TikTok)
2. TREND SCOUTING — Christian streetwear, faith creators, AU streetwear
3. COMPETITOR INTEL — Crae, Elevation Faith, NHIM, Active Faith, God Is Dope
4. PLATFORM DISCOVERY
5. HASHTAG + SOUND RESEARCH — feed insights to Jett and Nova
6. OPPORTUNITY MAPPING — collabs, podcasts, micro-influencers

═══════════════════════════════════════════════════
PLATFORMS YOU OWN
═══════════════════════════════════════════════════
📷 INSTAGRAM: Reels 60%, carousels 25%, Stories 15%. AEST: 7am, 12pm, 7-9pm.
📌 PINTEREST: huge for Christian fashion, underused. Search-driven, long-tail traffic.
🧵 THREADS: scripture + opinion = high reach. Post 1-2x daily.
🐦 X: founder voice, drop announcements.
📘 FACEBOOK: older audience but big for Christian groups. (NOTE: Chris posts to his own FB Page manually using content YOU draft. There is NO login flow — if asked, say "I'll draft the post, you paste it into your Page yourself.")
📺 YOUTUBE SHORTS: free repurpose of Jett's TikTok exports.

═══════════════════════════════════════════════════
HAND-OFFS
═══════════════════════════════════════════════════
TikTok video specifically? Output exactly:
ROUTE_TO_JETT: <brief>

Caption copy? "Nova handles copywriting. I'll plan, brief Nova for execution."

═══════════════════════════════════════════════════
OUTPUT
═══════════════════════════════════════════════════
Calendars: PLATFORM | POST TYPE | ASSET ID | HOOK | NOTES | WHY
Trend reports: WHO is doing it · WHAT angle · WHY it works · HOW Inspirit adapts
Strategy: bullets with reasoning + actionability

USE THE LIBRARY — reference real photo IDs.

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
  return `\n\n--- LIVE STATS (THE ONLY DATA YOU CAN REFERENCE) ---
Tracker: ${hasData ? "ACTIVE" : "INSTALLED, no events today"}
Today: $${stats.today_revenue || 0} revenue · ${stats.today_orders || 0} orders · ${stats.today_visitors || 0} visitors
7d: $${stats.week_revenue || 0} revenue · ${stats.week_visitors || 0} visitors

PENDING: Nova ${queues.nova_pending} · Grace ${queues.grace_pending} · Riley ${queues.riley_pending} · Jett ${queues.jett_pending}${queues.escalations > 0 ? ` · Escalations ${queues.escalations}` : ""}

Crew: 5/8 (Sage · Nova · Grace · Riley · Jett)
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

  // 🛡️ v1.0.1: SANITIZE before user sees it
  const sanitized = sanitizeSageReply(reply);
  if (sanitized.sanitized) {
    reply = sanitized.reply;
    await logActivity(env, "sage", "sanitized-violation", { preview: message.slice(0, 80) });
  }

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
  // 🛡️ v1.0.1: Apply sanitizer to Riley too (she was the one asking for FB password)
  const sanitized = sanitizeSageReply(output);
  let finalOutput = output;
  if (sanitized.sanitized) {
    finalOutput = sanitized.reply;
    await logActivity(env, "riley", "sanitized-violation", { brief: brief.slice(0, 80) });
  }
  const routing = extractRouting(finalOutput);
  if (routing && routing.target === "jett") {
    const jettResult = await jettBrief(env, routing.brief, "daily");
    const cleanedOutput = stripRoutingTokens(finalOutput);
    const item = { id: crypto.randomUUID(), crew: "riley", brief, output: cleanedOutput + `\n\n— Handed to Jett: video brief ready (${jettResult.id})`, ts: Date.now(), status: "pending" };
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
  const [kb, lib] = await Promise.all([getKB(env), getLibrary(env)]);
  let userMessage = brief;
  if (mode === "daily") userMessage = `Give me ONE shoot-ready video brief for today. Brief: ${brief}`;
  else if (mode === "week") userMessage = `Plan me 7 TikTok videos for the next 7 days, mixed across the 5 pillars. Brief: ${brief}\n\nFor each day output the FULL brief format. Label MONDAY through SUNDAY.`;
  else if (mode === "hook-lab") userMessage = `Give me 5 different hook variations for this topic. Use 5 different frameworks. Topic: ${brief}\n\nOutput format:\n1. [framework] — "[hook line]"\n   Why: [1 line]\n\n2. ...etc`;
  else if (mode === "audit") userMessage = `Performance audit. Stats:\n\n${brief}\n\nDiagnose what's working, what's not. Be brutal and specific.`;
  else if (mode === "trend-steal") userMessage = `Adapt this viral video for Inspirit. Source: ${brief}\n\nKeep what made it work, swap substance for Inspirit's brand. Output one full shoot-ready brief.`;
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
    env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"),
    env.INSPIRIT_KV.get("riley:queue"), env.INSPIRIT_KV.get("jett:queue")
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
  if (item) { item.status = status; item.reviewedAt = Date.now(); await env.INSPIRIT_KV.put(key, JSON.stringify(queue)); }
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
          version: "1.0.1 — Sage Hardened · No Password Asks Ever",
          crew_online: ["sage", "nova", "grace", "riley", "jett"],
          knowledge_base: "loaded",
          library: "ready",
          github_token: env.GITHUB_TOKEN ? "configured" : "MISSING",
          time: new Date().toISOString()
        });
      }

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
        const [novaRaw, graceRaw, rileyRaw, jettRaw] = await Promise.all([
          env.INSPIRIT_KV.get("nova:queue"), env.INSPIRIT_KV.get("grace:queue"),
          env.INSPIRIT_KV.get("riley:queue"), env.INSPIRIT_KV.get("jett:queue")
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
