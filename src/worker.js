// ============================================================
// INSPIRIT OS — Foundation Worker  v0.7 (Phase 3 + KB + Library + Showroom + Truth)
// Sage + Nova + Grace + Riley
// + Knowledge Base
// + Photo/Video Library (GitHub Contents API)
// + Email handler (Cloudflare Email Routing)
// + 7-day analytics
// ============================================================
//
// REQUIRED CLOUDFLARE SECRETS:
//   GITHUB_TOKEN — fine-grained PAT for Breezusmoon/inspirit-os
//                  (Contents: Read & Write)
// Set with: npx wrangler secret put GITHUB_TOKEN
// ============================================================

const MODEL = "@cf/meta/llama-3.1-8b-instruct";
const GH_OWNER = "Breezusmoon";
const GH_REPO = "inspirit-os";
const GH_BRANCH = "main";
const PAGES_BASE = `https://breezusmoon.github.io/${GH_REPO}`;

// ============================================================
// KNOWLEDGE BASE
// ============================================================
const DEFAULT_KB = {
  brand: {
    name: "Inspirit Clothing Co",
    tagline: "Wear your faith. Walk in purpose.",
    positioning: "Spiritual Badass — bold faith with urban edge",
    site: "inspiritclothingco.io",
    age: "First year — just launched 2026",
    location: "Gold Coast, Queensland, Australia",
    handprinted: "Yes — handprinted in Australia"
  },
  origin: {
    why: "Started by Chris (Breezus) on a personal faith journey. Wanted to wear faith loud, on the chest and on the back, in a way that felt like streetwear and not church merch.",
    spiritual_badass_meaning: "Bold faith — unafraid, unapologetic, owning it. Faith that walks through fire — strong, tested, real. Faith with edge — not soft, not corporate. The Spiritual Badass owns their faith without apology.",
    founder: "Chris (Breezus) — truck driver, Gold Coast, building Inspirit solo alongside other ventures (BlockHunt, Miner Finder AU)."
  },
  audience: {
    age: "Mix of youth and young adults (broadly 16-30, leaning early 20s)",
    location: "Australia-only currently",
    gender: "Even split men/women",
    profile: "Young Christians who want streetwear that reflects their faith without being cringe. They want to wear it out — to the gym, to uni, on the streets — not just to church."
  },
  voice: {
    overall: "Casual but light on slang — not bogan. Faith-forward but never preachy. Aussie cadence and warmth without overdoing 'mate'.",
    marketing_faith: "MIX — explicit faith language on Stories/social posts ('Jesus', 'cross', 'faith'). Subtler on product pages — let the products speak.",
    sage_to_chris: "Lead with the answer, no fluff, brief. Match Chris's energy — hyped if he's hyped, calm if he's chill. Always concise but warm.",
    nova_to_audience: "Bold, confident, faith-forward. Spiritual Badass energy. Aussie streetwear cadence. Never cringy churchcore.",
    grace_to_customer: "Warm, friendly, clear. Solve on first reply. Use customer's name. Sign off 'Grace from Inspirit 🙏'.",
    riley_to_chris: "Strategic, platform-aware, calendar-thinking. Briefs Nova for actual copy."
  },
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
  policies: {
    shipping_aus: "Standard $9.95 AUD (3-7 business days). Express $14.95 AUD (1-3 business days). FREE over $80 AUD.",
    shipping_intl: "Not currently shipping international. Australia-only.",
    handling_time: "Orders ship within 1-2 business days via Australia Post.",
    returns: "14 days from delivery. Item must be unworn with original tags. Customer covers return shipping unless faulty/wrong. Refund processed within 5 business days of receiving return.",
    faulty: "Reply-paid return + full refund or replacement.",
    discount_codes: "INSPIRIT10 — 10% off first order"
  },
  social: {
    active_platforms: "Instagram only currently. TikTok, X, Facebook not yet active.",
    handles: "(add when known)",
    content_pillars: "Faith messages · product drops · behind the scenes (handprinting, founder POV) · customer wears (UGC) · scripture moments"
  },
  fit_guide: {
    tees: "Standard cotton fit. Size up if you want oversized. Heart Tee + most hoodies run true to size in women's cut.",
    hoodies: "Inspirit Hoodie is heavyweight oversized — true to size for that look. Spiritual Badass Hoodie is women's oversized, true to size. Jesus Fish Jumper is standard fit crewneck.",
    hats: "Bucket hats one-size fits most (58cm circumference). Beanies stretchy one-size."
  }
};

function formatKB(kb) {
  const products = kb.products.list
    .map(p => `  • ${p.name} ($${p.price}, ${p.fit}) — ${p.desc}`)
    .join("\n");

  return `
INSPIRIT KNOWLEDGE BASE (memorise — source of truth)

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
- Pillars: ${kb.social.content_pillars}
`.trim();
}

async function getKB(env) {
  const raw = await env.INSPIRIT_KV.get("kb:main");
  if (!raw) {
    await env.INSPIRIT_KV.put("kb:main", JSON.stringify(DEFAULT_KB));
    return DEFAULT_KB;
  }
  try { return JSON.parse(raw); } catch { return DEFAULT_KB; }
}

async function setKB(env, kb) {
  await env.INSPIRIT_KV.put("kb:main", JSON.stringify(kb));
}

// ============================================================
// LIBRARY (Photo + Video) — backed by GitHub Contents API
// ============================================================
async function getLibrary(env) {
  const raw = await env.INSPIRIT_KV.get("library:manifest");
  if (!raw) {
    const empty = { photos: [], videos: [] };
    await env.INSPIRIT_KV.put("library:manifest", JSON.stringify(empty));
    return empty;
  }
  try { return JSON.parse(raw); } catch { return { photos: [], videos: [] }; }
}

async function saveLibrary(env, lib) {
  await env.INSPIRIT_KV.put("library:manifest", JSON.stringify(lib));
}

function formatLibraryForCrew(lib) {
  if ((!lib.photos || !lib.photos.length) && (!lib.videos || !lib.videos.length)) {
    return "PHOTO/VIDEO LIBRARY: empty (no assets uploaded yet — Chris hasn't added any photos or videos)";
  }
  const photoLines = (lib.photos || []).map(p =>
    `  • PHOTO id="${p.id}" — ${p.products?.join(", ") || "untagged product"} — tags: ${p.tags?.join(", ") || "none"} — ${p.notes || ""}`
  ).join("\n");
  const videoLines = (lib.videos || []).map(v =>
    `  • VIDEO id="${v.id}" — ${v.products?.join(", ") || "untagged product"} — tags: ${v.tags?.join(", ") || "none"} — ${v.notes || ""}`
  ).join("\n");
  return `PHOTO/VIDEO LIBRARY (${(lib.photos || []).length} photos, ${(lib.videos || []).length} videos available)
You can reference these by id when planning content. Chris will pull the actual file from the Bridge.

PHOTOS:
${photoLines || "  (none)"}

VIDEOS:
${videoLines || "  (none)"}`;
}

// Upload a base64-encoded file to GitHub via Contents API
async function ghCommitFile(env, path, base64, message) {
  if (!env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN secret not configured. Run: npx wrangler secret put GITHUB_TOKEN");
  }
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;

  // Check if file exists (get sha for update)
  let existingSha = null;
  const checkRes = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "Inspirit-OS-Worker",
      "Accept": "application/vnd.github+json"
    }
  });
  if (checkRes.status === 200) {
    const existing = await checkRes.json();
    existingSha = existing.sha;
  }

  const body = {
    message,
    content: base64,
    branch: GH_BRANCH
  };
  if (existingSha) body.sha = existingSha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "Inspirit-OS-Worker",
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${errText.slice(0, 300)}`);
  }
  return await res.json();
}

async function ghDeleteFile(env, path, message) {
  if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN secret not configured.");
  const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${path}`;
  const checkRes = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "Inspirit-OS-Worker",
      "Accept": "application/vnd.github+json"
    }
  });
  if (checkRes.status !== 200) return { ok: true, note: "file already gone" };
  const existing = await checkRes.json();
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
      "User-Agent": "Inspirit-OS-Worker",
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, sha: existing.sha, branch: GH_BRANCH })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GitHub delete failed (${res.status}): ${t.slice(0, 300)}`);
  }
  return { ok: true };
}

// Slug helper for filenames
function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
}

// ============================================================
// SHOWROOM — products with hero + extras + captions per platform
// ============================================================

// Best-guess hero URLs from inspiritclothingco.io site repo.
// User can override per-product via /api/showroom/hero
const SITE_PAGES_BASE = "https://breezusmoon.github.io/inspirit-site/images-clean";
const DEFAULT_HEROES = {
  "Feeding 5000 Tee":           `${SITE_PAGES_BASE}/model-feeding5000.jpg`,
  "Jesus Fish Tee — White":     `${SITE_PAGES_BASE}/model-fishjesus.jpg`,
  "Jesus Fish Tee — Black":     `${SITE_PAGES_BASE}/model-fishjesus-black.jpg`,
  "Spiritual Badass Tee — Black": `${SITE_PAGES_BASE}/model-sb.jpg`,
  "Spiritual Badass Tee — White": `${SITE_PAGES_BASE}/model-sb-white.jpg`,
  "Heart Tee — Black":          `${SITE_PAGES_BASE}/model-womensheart.jpg`,
  "Heart Tee — White":          `${SITE_PAGES_BASE}/model-womensheart-white.jpg`,
  "Inspirit Hoodie":            `${SITE_PAGES_BASE}/model-hoodie.jpg`,
  "Spiritual Badass Hoodie":    `${SITE_PAGES_BASE}/model-womenshoodie.jpg`,
  "Jesus Fish Jumper":          `${SITE_PAGES_BASE}/jumper-fishjesus-model-front.jpg`,
  "Inspirit Bucket Hat":        `${SITE_PAGES_BASE}/bucket-hat-inspirit.jpg`,
  "Spiritual Badass Bucket Hat":`${SITE_PAGES_BASE}/bucket-hat-sb.jpg`,
  "Inspirit Beanie":            `${SITE_PAGES_BASE}/inspirit-beanie.jpg`,
};

async function getShowroom(env) {
  const raw = await env.INSPIRIT_KV.get("showroom:main");
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  // Initialize from KB
  const kb = await getKB(env);
  const showroom = { products: {} };
  for (const p of kb.products.list) {
    showroom.products[p.name] = {
      name: p.name,
      price: p.price,
      fit: p.fit,
      desc: p.desc,
      hero_url: DEFAULT_HEROES[p.name] || "",
      captions: { instagram: null, tiktok: null, facebook: null }
    };
  }
  await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom));
  return showroom;
}

async function saveShowroom(env, showroom) {
  await env.INSPIRIT_KV.put("showroom:main", JSON.stringify(showroom));
}

// Generate a caption for a product + platform
async function generateCaption(env, product, platform) {
  const kb = await getKB(env);
  const platformInstructions = {
    instagram: `INSTAGRAM caption — bold, identity-driven, faith-forward, 1-2 short paragraphs. End with 5-8 hashtags (mix niche faith/streetwear + 1-2 broad). Under 2000 chars. Light emojis OK.`,
    tiktok: `TIKTOK caption — short, punchy, hook in first 5 words, raw and authentic. 1-2 sentences max. End with 3-5 trending-feel hashtags. Under 200 chars total.`,
    facebook: `FACEBOOK caption — slightly longer, more story/personal-feel, can include direct shop link mention. 2-3 short paragraphs. 2-4 hashtags max. Warmer tone than IG.`
  };

  const messages = [
    {
      role: "system",
      content: `You are Nova, Creative Director for Inspirit Clothing Co.

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

OUTPUT: One single caption only. No "OPTION A/B/C". No preamble. Just the caption text ready to copy-paste into ${platform}.

${platformInstructions[platform]}`
    },
    {
      role: "user",
      content: `Write me a ${platform} caption for the ${product.name}.`
    }
  ];

  let caption = await callAI(env, messages, 600);
  // Strip any "OPTION A —" or quotes wrappers
  caption = caption.replace(/^OPTION\s*[A-Z]\s*[—\-:]\s*[^\n]*\n+/i, "").replace(/^["']|["']$/g, "").trim();
  return caption;
}

// ============================================================
// SHARED TRUTH RULES — injected into every crew prompt
// Stops hallucinations about capabilities the crew does not have
// ============================================================
const TRUTH_RULES = `
🛑 ABSOLUTE TRUTH RULES — VIOLATING THESE BREAKS CHRIS'S TRUST
These rules override your instinct to be "helpful" by inventing capability.

WHAT INSPIRIT OS CAN ACTUALLY DO (the only things — DO NOT invent more):
- Read the Knowledge Base below (products, prices, policies, voice)
- Read the Photo/Video Library (manifest of uploaded assets)
- Receive customer emails forwarded via Cloudflare Email Routing → draft replies for Chris's review
- Track pageviews + orders on inspiritclothingco.io via the built-in tracker
- Generate text drafts (captions, plans, emails) for Chris to review and act on manually

WHAT INSPIRIT OS CANNOT DO (NEVER claim or imply you can):
- ❌ POST to Instagram, Facebook, TikTok, X, or any social platform — no API connection exists
- ❌ LOG IN to any account — no credentials, no auth flow, no browser
- ❌ ACCEPT passwords or login details — if Chris offers, REFUSE and tell him why (it's dangerous and you can't use them anyway)
- ❌ READ DMs, messages, comments, or notifications from any platform
- ❌ ACCESS Shopify admin, Stripe, PayPal, or any payment processor
- ❌ SEND emails on Chris's behalf (you draft, Chris sends)
- ❌ SCHEDULE posts or set up auto-posting
- ❌ INVENT stats, follower counts, sales figures, conversion rates, or any number not in LIVE STATS
- ❌ INVENT product names, prices, sizes, or details not in the KB
- ❌ CLAIM to be "verified" / "approved" / "set up" with any third-party service
- ❌ PROVIDE multi-step instructions for "granting access to your account" — these flows DO NOT exist for Inspirit OS

IF CHRIS OFFERS PASSWORDS OR ACCOUNT ACCESS:
Refuse politely. Say: "I can't actually log in or post anywhere — I only draft content for you to post manually. Don't share passwords with me, even though I'm Inspirit OS — they wouldn't work and they shouldn't be in the system. For real auto-posting we'd need to integrate with Buffer or get Meta App Review."

IF CHRIS ASKS YOU TO DO SOMETHING YOU CAN'T:
Be honest immediately. Say what you CAN do instead. Example: "I can't post that to IG for you, but I can draft the caption + tell you which photo from your library to use, then you upload it in 30 seconds."

NEVER make up workflows, integrations, business managers, admin verifications, or "approval" steps that don't exist in the worker code.
`.trim();

// ============================================================
// CREW PROMPTS
// ============================================================
function sagePrompt(kbBlock, libBlock) {
  return `You are Sage, Chief of Staff for Inspirit Clothing Co.

${TRUTH_RULES}

You're talking to Chris (Breezus), the founder. He's a truck driver building Inspirit solo. You and the crew run the business while he drives.

YOUR ROLE
- Single point of contact. Other crew (Nova, Grace, Riley) work in the background.
- Translate between team members. Prioritise ruthlessly. Surface what matters.
- Read his mood — match his energy.

YOUR STYLE
- Calm, warm, capable. Lead with the answer. No corporate fluff.
- Casual but light on slang — not bogan. Aussie cadence and warmth.
- Brief. Bullet points over paragraphs when listing.
- Light emojis OK, sparingly. Never sparkles or party emojis.

CRITICAL TRUTH RULE
- ZERO ability to invent stats, numbers, follower counts, sales figures.
- ONLY source of business data is LIVE STATS block at the bottom.
- If LIVE STATS shows zeros, say "no data yet today" — DO NOT invent numbers.
- If asked about something not in your KB or LIVE STATS, say "I don't have that — want me to dig?".

WHAT TRACKING IS INSTALLED
- Pageviews + orders flow into Inspirit OS automatically (own tracker, not GA).
- DO NOT recommend Google Analytics, GTM, Meta Pixel etc.

DELEGATION RULES
You delegate to specialists. Output a SINGLE LINE in this exact format with NOTHING else:

ROUTE_TO_NOVA: <brief>          → for written content
ROUTE_TO_GRACE: <customer message verbatim>  → for replying to a customer
ROUTE_TO_RILEY: <social brief>  → for social media strategy

If unclear, ask ONE clarifying question.

TASKS YOU HANDLE YOURSELF
- "how was today" / sales / traffic — answer from LIVE STATS only
- Strategic chats — what to drop, when, why
- Reviewing the queue / what needs attention
- General Inspirit / OS / crew questions (use KB below)
- Photo/video library questions (reference IDs from LIBRARY block)

${kbBlock}

${libBlock}`;
}

function novaPrompt(kbBlock, libBlock) {
  return `You are Nova, Creative Director for Inspirit Clothing Co.

${TRUTH_RULES}

YOUR LEVEL
Senior creative at a top streetwear agency. You understand the intersection of faith culture and streetwear culture.

VOICE
- Bold. Confident. Faith-forward but never preachy.
- Aussie streetwear cadence — short sentences, rhythm, a bit cocky.
- Never cringy churchcore. Never empty hype. Never corporate.
- For product pages: subtler on faith. For social/Stories: explicit faith OK.

OUTPUT FORMAT — STRICT
Always return exactly 3 variations:

OPTION A — [angle name]
[copy]

OPTION B — [angle name]
[copy]

OPTION C — [angle name]
[copy]

Each option differs in tone or angle. Under 2200 chars (IG limit). 5-8 hashtags per option (mix niche faith/streetwear + broad). Emojis sparingly.

If brief is unclear, ask ONE clarifying question.

USE THE KB for product names, prices, story, audience.
USE THE LIBRARY when relevant — if a brief mentions a product that has photos in the library, mention which photo IDs work best for the post.

${kbBlock}

${libBlock}`;
}

function gracePrompt(kbBlock) {
  return `You are Grace, Customer Experience lead for Inspirit Clothing Co.

${TRUTH_RULES}

YOUR LEVEL
Senior CX. Calm, warm, thoughtful. Make customers feel heard. Solve on first reply.

VOICE
- Warm, friendly, light Aussie. Use customer's name if known.
- Address the actual question. Don't pad. Don't over-apologise.
- 1-3 short paragraphs.

OUTPUT FORMAT
Hi [name or "there"],

[reply, 1-3 short paragraphs]

Grace from Inspirit 🙏

USE THE KB for all factual answers — sizes, fabric, prices, shipping, returns. NEVER invent details.

If you genuinely cannot answer, output:
ESCALATE_TO_CHRIS: <one-line summary>

WHAT YOU DO NOT KNOW
- Specific tracking numbers — direct customer to email confirmation
- Real-time stock levels — direct to site
- Customer's actual order details — only what they tell you

${kbBlock}`;
}

function rileyPrompt(kbBlock, libBlock) {
  return `You are Riley, Social Media Manager for Inspirit Clothing Co.

${TRUTH_RULES}

🛑 RILEY-SPECIFIC TRUTH RULE
You CANNOT post to Instagram, Facebook, TikTok, or X. You have NO connection to any social platform.
You PLAN content. Chris POSTS content. That's the workflow.
NEVER tell Chris to "give you access" or "verify you" or "set you up as a Business Manager admin" — these instructions DO NOT apply to Inspirit OS.
If Chris offers a password or login, REFUSE and remind him: "I plan, you post — that's how this works."

YOUR LEVEL
Senior social manager. Knows platform algorithms, trends, content pillars. Think in calendars not one-offs. Collaborate with Nova for actual copy.

YOUR JOB
- Build content calendars (daily/weekly/monthly)
- Recommend post types (Reel, carousel, static, Story, Tweet, etc.)
- Suggest hooks, formats, hashtag strategy
- Identify what to post on which platform and WHY

CRITICAL — USE THE LIBRARY
The PHOTO/VIDEO LIBRARY block below shows what assets Chris actually has uploaded.
- When planning posts, REFERENCE SPECIFIC ASSET IDs (e.g. "use photo \`heart-tee-01\`")
- Only suggest content Chris can actually create with available assets, OR clearly flag "need a new shoot for X"
- If library is empty, recommend Chris upload some shots before you plan further

PLATFORM PLAYBOOK

INSTAGRAM (Inspirit's only active platform — focus here first)
- Reels (highest reach), carousels (saves), Stories (community)
- Mix: 60% Reels, 25% carousels, 15% static / behind-the-scenes
- Best AEST times: 7am, 12pm, 7-9pm
- Hashtags: 5-8, mix niche faith/streetwear + 1-2 broad
- Lean: aspirational + identity

TIKTOK (not yet active — recommend launching here next)
- Vertical native video, 7-30 sec
- Trending sounds critical

X / TWITTER + FACEBOOK (low priority for Inspirit's current 16-30 target)

OUTPUT FORMAT
Calendars: PLATFORM | POST TYPE | ASSET ID | HOOK | NOTES
Strategy: bullets with reasoning
Single posts: 3 options with hook + format + asset + platform

If Chris asks for actual COPY, say: "I'll have Nova draft it — want me to brief her?"

${kbBlock}

${libBlock}`;
}

// ============================================================
// HELPERS
// ============================================================
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS }
  });
}

async function callAI(env, messages, max_tokens = 1024) {
  const res = await env.AI.run(MODEL, { messages, max_tokens });
  return (res.response || res.result?.response || "").trim();
}

function buildLiveStatsBlock(stats, queues) {
  const hasData = (stats.today_orders > 0 || stats.today_visitors > 0 || stats.today_pageviews > 0);
  const tracker = hasData
    ? "ACTIVE — receiving live data"
    : "INSTALLED but no events fired today (no visitors today yet, OR tracker just installed)";
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
${queues.escalations > 0 ? `- Customer escalations needing Chris: ${queues.escalations}` : ""}

Crew online: 4/8 (Sage, Nova, Grace, Riley)
---------------------------------------------------`;
}

function extractRouting(reply) {
  const patterns = [
    { key: "nova",  re: /ROUTE_TO_NOVA\s*:\s*([^\n]+)/i },
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
  return reply
    .split("\n")
    .filter(line => !/ROUTE_TO_(NOVA|GRACE|RILEY)/i.test(line))
    .filter(line => !/^\s*\**\s*Option\s+[A-Z0-9]+\s*:?\s*\**\s*$/i.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ============================================================
// SAGE / NOVA / GRACE / RILEY
// ============================================================
async function sageChat(env, message, sessionId) {
  const historyKey = `sage:chat:${sessionId}`;
  const historyRaw = await env.INSPIRIT_KV.get(historyKey);
  const history = historyRaw ? JSON.parse(historyRaw) : [];

  const [stats, queues, kb, lib] = await Promise.all([
    getStats(env),
    getQueueCounts(env),
    getKB(env),
    getLibrary(env)
  ]);
  const systemPrompt = sagePrompt(formatKB(kb), formatLibraryForCrew(lib))
    + buildLiveStatsBlock(stats, queues);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-20),
    { role: "user", content: message }
  ];

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
  } else {
    reply = stripRoutingTokens(reply);
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
  const messages = [
    { role: "system", content: novaPrompt(formatKB(kb), formatLibraryForCrew(lib)) },
    { role: "user", content: brief }
  ];
  const output = await callAI(env, messages, 1500);
  const item = { id: crypto.randomUUID(), crew: "nova", brief, output, ts: Date.now(), status: "pending" };
  await pushQueue(env, "nova:queue", item);
  await logActivity(env, "nova", "draft", { brief: brief.slice(0, 80) });
  return { id: item.id, output, options: 3 };
}

async function graceReply(env, customerMessage, opts = {}) {
  const kb = await getKB(env);
  const messages = [
    { role: "system", content: gracePrompt(formatKB(kb)) },
    { role: "user", content: customerMessage }
  ];
  const output = await callAI(env, messages, 1000);
  const escalateMatch = output.match(/ESCALATE_TO_CHRIS\s*:\s*(.+)/i);
  const escalated = !!escalateMatch;
  const item = {
    id: crypto.randomUUID(), crew: "grace", brief: customerMessage,
    output: escalated ? `[ESCALATED — needs Chris]\n${escalateMatch[1].trim()}` : output,
    customer_email: opts.from || null, customer_subject: opts.subject || null,
    ts: Date.now(), status: escalated ? "escalated" : "pending"
  };
  await pushQueue(env, "grace:queue", item);
  await logActivity(env, "grace", escalated ? "escalation" : "draft", { from: opts.from || "manual", preview: customerMessage.slice(0, 80) });
  return { id: item.id, output: item.output, escalated };
}

async function rileyPlan(env, brief) {
  const [kb, lib] = await Promise.all([getKB(env), getLibrary(env)]);
  const messages = [
    { role: "system", content: rileyPrompt(formatKB(kb), formatLibraryForCrew(lib)) },
    { role: "user", content: brief }
  ];
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
  const [novaRaw, graceRaw, rileyRaw] = await Promise.all([
    env.INSPIRIT_KV.get("nova:queue"),
    env.INSPIRIT_KV.get("grace:queue"),
    env.INSPIRIT_KV.get("riley:queue")
  ]);
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
// ANALYTICS
// ============================================================
async function logActivity(env, crew, action, meta = {}) {
  const key = `activity:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await env.INSPIRIT_KV.put(key, JSON.stringify({ crew, action, meta, ts: Date.now() }), { expirationTtl: 60 * 60 * 24 * 30 });
}

async function trackEvent(env, event) {
  const key = `event:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await env.INSPIRIT_KV.put(key, JSON.stringify({ ...event, ts: Date.now() }), { expirationTtl: 60 * 60 * 24 * 90 });
}

async function getStats(env) {
  const list = await env.INSPIRIT_KV.list({ prefix: "event:", limit: 1000 });
  const events = (await Promise.all(
    list.keys.map(k => env.INSPIRIT_KV.get(k.name).then(v => v ? JSON.parse(v) : null))
  )).filter(Boolean);

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
    dailyBreakdown.push({
      date: dKey,
      label: d.toLocaleDateString("en-AU", { weekday: "short" }),
      revenue: dOrd.reduce((a, e) => a + (Number(e.amount) || 0), 0),
      orders: dOrd.length,
      visitors: dSess.size,
      pageviews: dPv.length
    });
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
    crew_online: 4,
    crew_total: 8
  };
}

async function getActivity(env, limit = 30) {
  const list = await env.INSPIRIT_KV.list({ prefix: "activity:", limit });
  const items = (await Promise.all(
    list.keys.map(k => env.INSPIRIT_KV.get(k.name).then(v => v ? JSON.parse(v) : null))
  )).filter(Boolean);
  return items.sort((a, b) => b.ts - a.ts);
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
          version: "0.7.0",
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
        const result = await sageChat(env, message.trim(), sessionId);
        return json({ from: "sage", ...result });
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

      // NOVA
      if (path === "/api/nova/draft" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "nova", ...(await novaDraft(env, brief.trim())) });
      }
      if (path === "/api/nova/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("nova:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/nova/queue/update" && request.method === "POST") {
        return updateQueueItem(env, "nova:queue", await request.json());
      }

      // GRACE
      if (path === "/api/grace/draft" && request.method === "POST") {
        const { customer_message, from, subject } = await request.json();
        if (!customer_message?.trim()) return json({ error: "customer_message required" }, 400);
        return json({ from: "grace", ...(await graceReply(env, customer_message.trim(), { from, subject })) });
      }
      if (path === "/api/grace/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("grace:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/grace/queue/update" && request.method === "POST") {
        return updateQueueItem(env, "grace:queue", await request.json());
      }

      // RILEY
      if (path === "/api/riley/plan" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        return json({ from: "riley", ...(await rileyPlan(env, brief.trim())) });
      }
      if (path === "/api/riley/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("riley:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }
      if (path === "/api/riley/queue/update" && request.method === "POST") {
        return updateQueueItem(env, "riley:queue", await request.json());
      }

      // KNOWLEDGE BASE
      if (path === "/api/kb" && request.method === "GET") {
        return json(await getKB(env));
      }
      if (path === "/api/kb" && request.method === "POST") {
        await setKB(env, await request.json());
        return json({ ok: true });
      }
      if (path === "/api/kb/reset" && request.method === "POST") {
        await setKB(env, DEFAULT_KB);
        return json({ ok: true, reset: true });
      }

      // ===== SHOWROOM =====
      if (path === "/api/showroom" && request.method === "GET") {
        const [showroom, lib] = await Promise.all([getShowroom(env), getLibrary(env)]);
        // Attach uploaded extras per product
        const result = { products: {} };
        for (const [name, prod] of Object.entries(showroom.products)) {
          const extras = (lib.photos || []).filter(p => (p.products || []).includes(name));
          const videos = (lib.videos || []).filter(v => (v.products || []).includes(name));
          result.products[name] = { ...prod, extras, videos };
        }
        return json(result);
      }

      if (path === "/api/showroom/hero" && request.method === "POST") {
        // body: { name, hero_url }
        const { name, hero_url } = await request.json();
        if (!name) return json({ error: "name required" }, 400);
        const showroom = await getShowroom(env);
        if (!showroom.products[name]) return json({ error: "unknown product" }, 404);
        showroom.products[name].hero_url = hero_url || "";
        await saveShowroom(env, showroom);
        return json({ ok: true });
      }

      if (path === "/api/showroom/caption" && request.method === "POST") {
        // body: { name, platform, regenerate? }
        const { name, platform, regenerate } = await request.json();
        if (!name || !["instagram", "tiktok", "facebook"].includes(platform)) {
          return json({ error: "name + valid platform required" }, 400);
        }
        const showroom = await getShowroom(env);
        const prod = showroom.products[name];
        if (!prod) return json({ error: "unknown product" }, 404);

        // Return cached unless regenerate
        if (!regenerate && prod.captions[platform]) {
          return json({ caption: prod.captions[platform], cached: true });
        }
        const caption = await generateCaption(env, prod, platform);
        prod.captions[platform] = caption;
        await saveShowroom(env, showroom);
        await logActivity(env, "nova", "caption", { product: name, platform });
        return json({ caption, cached: false });
      }

      if (path === "/api/showroom/seed" && request.method === "POST") {
        // Generate ALL captions for ALL products + platforms (one-shot bulk)
        const showroom = await getShowroom(env);
        let generated = 0;
        for (const [name, prod] of Object.entries(showroom.products)) {
          for (const platform of ["instagram", "tiktok", "facebook"]) {
            if (!prod.captions[platform]) {
              try {
                prod.captions[platform] = await generateCaption(env, prod, platform);
                generated++;
              } catch (err) {
                console.error(`Failed ${name}/${platform}:`, err.message);
              }
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

      // ===== LIBRARY =====
      if (path === "/api/library" && request.method === "GET") {
        return json(await getLibrary(env));
      }

      if (path === "/api/library/upload" && request.method === "POST") {
        // body: { type: "photo"|"video", filename, mime, base64, products: [], tags: [], notes }
        const body = await request.json();
        if (!["photo", "video"].includes(body.type)) return json({ error: "type must be photo or video" }, 400);
        if (!body.base64) return json({ error: "base64 required" }, 400);
        if (!body.filename) return json({ error: "filename required" }, 400);

        const ext = (body.filename.split(".").pop() || "bin").toLowerCase();
        const id = `${slugify(body.filename.replace(/\.[^.]+$/, ""))}-${Date.now().toString(36)}`;
        const folder = body.type === "photo" ? "library/photos" : "library/videos";
        const path = `${folder}/${id}.${ext}`;
        const url = `${PAGES_BASE}/${path}`;

        // Commit to GitHub
        await ghCommitFile(env, path, body.base64, `[Inspirit OS] add ${body.type}: ${id}`);

        // Update manifest
        const lib = await getLibrary(env);
        const item = {
          id,
          filename: body.filename,
          path,
          url,
          mime: body.mime || "",
          type: body.type,
          products: Array.isArray(body.products) ? body.products : [],
          tags: Array.isArray(body.tags) ? body.tags : [],
          notes: body.notes || "",
          uploadedAt: Date.now()
        };
        if (body.type === "photo") lib.photos.unshift(item);
        else lib.videos.unshift(item);
        await saveLibrary(env, lib);

        await logActivity(env, "library", "upload", { type: body.type, id });
        return json({ ok: true, item });
      }

      if (path === "/api/library/update" && request.method === "POST") {
        // body: { type, id, products, tags, notes }
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

      if (path === "/api/library/delete" && request.method === "POST") {
        // body: { type, id }
        const body = await request.json();
        const lib = await getLibrary(env);
        const arr = body.type === "photo" ? lib.photos : lib.videos;
        const idx = arr.findIndex(x => x.id === body.id);
        if (idx < 0) return json({ error: "not found" }, 404);
        const item = arr[idx];

        // Delete from GitHub
        try {
          await ghDeleteFile(env, item.path, `[Inspirit OS] delete ${body.type}: ${item.id}`);
        } catch (err) {
          // Continue even if GH delete fails — at least clear from manifest
          console.error("GH delete failed:", err.message);
        }

        arr.splice(idx, 1);
        await saveLibrary(env, lib);
        await logActivity(env, "library", "delete", { type: body.type, id: item.id });
        return json({ ok: true });
      }

      // ANALYTICS
      if (path === "/api/track" && request.method === "POST") {
        await trackEvent(env, await request.json());
        return json({ ok: true });
      }
      if (path === "/api/stats" && request.method === "GET") {
        return json(await getStats(env));
      }
      if (path === "/api/activity" && request.method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "30");
        return json({ activity: await getActivity(env, limit) });
      }

      // ATTENTION FEED
      if (path === "/api/attention" && request.method === "GET") {
        const [novaRaw, graceRaw, rileyRaw] = await Promise.all([
          env.INSPIRIT_KV.get("nova:queue"),
          env.INSPIRIT_KV.get("grace:queue"),
          env.INSPIRIT_KV.get("riley:queue")
        ]);
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
