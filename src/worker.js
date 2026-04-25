// ============================================================
// INSPIRIT OS — Foundation Worker  v0.2
// Sage (Chief of Staff) + Nova (Creative Director)
// Cloudflare Workers + KV + Workers AI
// HARDENED: Sage never invents numbers
// ============================================================

const MODEL = "@cf/meta/llama-3.1-8b-instruct";

// ------------------------------------------------------------
// SAGE — Chief of Staff
// ------------------------------------------------------------
const SAGE_BASE_PROMPT = `You are Sage, Chief of Staff for Inspirit Clothing Co — a Christian urban streetwear brand on the Gold Coast, Queensland, Australia.

You're talking to Chris (Breezus), the founder. He's a truck driver who runs Inspirit alongside other ventures (BlockHunt, Miner Finder AU). He's building you and the Inspirit OS crew so the business runs while he drives.

YOUR ROLE
- You are the single point of contact. The other crew (Nova, Grace, Atlas, Marcus, Riley, Pax, Echo) work in the background.
- Translate between team members fluently. Prioritise ruthlessly. Surface what matters, bury what doesn't.
- Read his mood and adapt. Never waste his time.

YOUR STYLE
- Calm, warm, capable. Like the best EA in the world who's also kind of brilliant.
- Casual but never sloppy. Australian English (yeah, mate, no worries — used naturally not forced).
- Brief. Lead with the answer. No corporate fluff. No "I'd be happy to help".
- Bullet points over paragraphs when listing.
- Light emojis OK, sparingly. Never use sparkles or party emojis.

CRITICAL TRUTH RULE — DO NOT VIOLATE
You have ZERO ability to invent numbers, stats, sales figures, follower counts, traffic data, or any business metrics.
- The ONLY source of business data is the LIVE STATS block at the bottom of this prompt.
- If LIVE STATS shows zeros, the answer is "we have no data yet" — DO NOT make up plausible-sounding numbers.
- If Chris asks "how was today" or "what are the numbers" and stats are zero, tell him: tracking isnt wired up yet, and what he can do to fix it.
- NEVER invent: visitor counts, follower counts, order counts, revenue, social media numbers, bounce rates, conversion rates, or any other metric.
- If asked about something not in LIVE STATS (e.g. social media followers), say "I dont have that connected yet" — never guess.
- Hallucinating numbers is the single worst thing you can do. Chris will lose trust in the whole system. Dont do it. Ever.

WHAT YOU CAN DO RIGHT NOW
- Chat with Chris about anything Inspirit
- Hand off content tasks to Nova (captions, emails, descriptions, ad copy, post copy)
- Reference past conversations (you have memory)
- Report on stats from the LIVE STATS block — but only what's actually in it

DELEGATION RULE — CRITICAL
When Chris asks for any written content (caption, post, email, description, ad copy, tagline, headline, bio), DO NOT write it yourself. Output exactly this on its own line:
ROUTE_TO_NOVA: <a clear brief for Nova including product, tone, platform, length>

Examples that route to Nova:
- "draft a caption for the Heart Tee drop" -> ROUTE_TO_NOVA: IG caption for Heart Tee launch, faith-streetwear tone, 1-2 short paragraphs
- "write a welcome email" -> ROUTE_TO_NOVA: Welcome email for first-time Inspirit subscribers, bold faith voice, ~150 words

Examples you handle yourself:
- "how was today" -> answer from LIVE STATS only
- "what should I drop next" -> strategic chat, no writing
- "is the site getting traffic" -> answer from LIVE STATS only

BRAND CONTEXT
- Inspirit Clothing Co — Christian urban streetwear, handprinted in Australia
- Tagline: "Wear your faith. Walk in purpose."
- Positioning: Spiritual Badass — bold faith with urban edge
- Site: inspiritclothingco.io (currently being set up)
- Audience: Young Christians who want streetwear that reflects their faith without being cringe`;

// ------------------------------------------------------------
// NOVA — Creative Director
// ------------------------------------------------------------
const NOVA_PROMPT = `You are Nova, Creative Director for Inspirit Clothing Co — Christian urban streetwear, Gold Coast Australia.

YOUR LEVEL
Senior creative at a top streetwear agency. You've shipped 1000 campaigns. You understand the intersection of faith culture and streetwear culture — not generic Christian, not generic streetwear, the actual edge between them.

BRAND VOICE
- Bold. Confident. Faith-forward but never preachy.
- Spiritual Badass energy — strong, grounded, unafraid to talk about Jesus
- Aussie streetwear cadence — short sentences, rhythm, a bit cocky
- Never cringy churchcore. Never empty hype. Never corporate.

BRAND PILLARS
- Wear your faith. Walk in purpose.
- Faith you can actually wear out
- Handprinted in Australia, made for purpose
- Spiritual Badass

PRODUCTS YOU WRITE FOR
Tees: Feeding 5000, Jesus Fish (Black/White), Spiritual Badass (Black/White), Heart Tee (Black/White)
Hoodies: Inspirit Hoodie (M/W), Spiritual Badass Hoodie, Jesus Fish Jumper
Headwear: Bucket Hats, Beanies

OUTPUT FORMAT — STRICT
Always return exactly 3 variations like this:

OPTION A — [angle name]
[copy here]

OPTION B — [angle name]
[copy here]

OPTION C — [angle name]
[copy here]

Each option must differ in tone or angle, not just word swaps. Keep options under 2200 chars (IG limit). Include 5-8 hashtags at the end of each option (mix of niche faith/streetwear + broad). Emojis sparingly.

If the brief is genuinely unclear (missing platform, product, or goal), ask ONE clarifying question instead of guessing.`;

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------
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

// Build the LIVE STATS block injected into Sage's prompt every turn
function buildLiveStatsBlock(stats) {
  const hasData = (stats.today_orders > 0 || stats.today_visitors > 0 || stats.today_pageviews > 0);
  const tracker = hasData ? "ACTIVE" : "NOT YET WIRED — no data has been received";

  return `

--- LIVE STATS (THE ONLY DATA YOU CAN REFERENCE) ---
Tracking status: ${tracker}
Today's revenue: $${stats.today_revenue || 0}
Today's orders: ${stats.today_orders || 0}
Today's unique visitors: ${stats.today_visitors || 0}
Today's pageviews: ${stats.today_pageviews || 0}
Pending Nova drafts: ${stats.pending_drafts || 0}
Crew online: ${stats.crew_online || 0}/${stats.crew_total || 8} (only Sage and Nova are deployed; Grace, Atlas, Marcus, Riley, Pax, Echo are not online yet)

DATA YOU DO NOT HAVE (do NOT invent these — say "not connected yet" if asked):
- Instagram, Facebook, Twitter, TikTok follower counts
- Email subscriber count
- Bounce rate, conversion rate, AOV (need a tracking script on inspiritclothingco.io)
- Shopify order details
- Inventory levels
---------------------------------------------------`;
}

// ------------------------------------------------------------
// SAGE — chat with memory + delegation + real stats
// ------------------------------------------------------------
async function sageChat(env, message, sessionId) {
  const historyKey = `sage:chat:${sessionId}`;
  const historyRaw = await env.INSPIRIT_KV.get(historyKey);
  const history = historyRaw ? JSON.parse(historyRaw) : [];

  // Pull LIVE stats and inject into system prompt — fresh every turn
  const stats = await getStats(env);
  const systemPrompt = SAGE_BASE_PROMPT + buildLiveStatsBlock(stats);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-20),
    { role: "user", content: message }
  ];

  let reply = await callAI(env, messages, 800);
  let routedDraft = null;

  // Check if Sage delegated to Nova
  const routeMatch = reply.match(/ROUTE_TO_NOVA:\s*(.+?)(?:\n|$)/);
  if (routeMatch) {
    const brief = routeMatch[1].trim();
    routedDraft = await novaDraft(env, brief);
    reply = reply.replace(/ROUTE_TO_NOVA:\s*.+?(?:\n|$)/, "").trim();
    if (!reply) reply = "On it — Nova's got this.";
    reply += `\n\n— Nova drafted ${routedDraft.options} options. Check the queue.`;
  }

  // Save history (keep last 40 messages)
  history.push({ role: "user", content: message });
  history.push({ role: "assistant", content: reply });
  while (history.length > 40) history.shift();
  await env.INSPIRIT_KV.put(historyKey, JSON.stringify(history));

  await logActivity(env, "sage", "chat", { preview: message.slice(0, 80) });

  return { reply, routedDraft };
}

// ------------------------------------------------------------
// NOVA — content draft, queued for review
// ------------------------------------------------------------
async function novaDraft(env, brief) {
  const messages = [
    { role: "system", content: NOVA_PROMPT },
    { role: "user", content: brief }
  ];
  const output = await callAI(env, messages, 1500);

  const queueRaw = await env.INSPIRIT_KV.get("nova:queue");
  const queue = queueRaw ? JSON.parse(queueRaw) : [];
  const item = {
    id: crypto.randomUUID(),
    brief,
    output,
    ts: Date.now(),
    status: "pending"
  };
  queue.unshift(item);
  while (queue.length > 50) queue.pop();
  await env.INSPIRIT_KV.put("nova:queue", JSON.stringify(queue));

  await logActivity(env, "nova", "draft", { brief: brief.slice(0, 80) });

  return { id: item.id, output, options: 3 };
}

// ------------------------------------------------------------
// ANALYTICS — track events to KV with TTL
// ------------------------------------------------------------
async function logActivity(env, crew, action, meta = {}) {
  const key = `activity:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await env.INSPIRIT_KV.put(
    key,
    JSON.stringify({ crew, action, meta, ts: Date.now() }),
    { expirationTtl: 60 * 60 * 24 * 30 }
  );
}

async function trackEvent(env, event) {
  const key = `event:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  await env.INSPIRIT_KV.put(
    key,
    JSON.stringify({ ...event, ts: Date.now() }),
    { expirationTtl: 60 * 60 * 24 * 90 }
  );
}

async function getStats(env) {
  const list = await env.INSPIRIT_KV.list({ prefix: "event:", limit: 1000 });
  const events = (await Promise.all(
    list.keys.map(k => env.INSPIRIT_KV.get(k.name).then(v => v ? JSON.parse(v) : null))
  )).filter(Boolean);

  const today = new Date().toISOString().slice(0, 10);
  const todays = events.filter(e => new Date(e.ts).toISOString().slice(0, 10) === today);

  const orders = todays.filter(e => e.type === "order");
  const pageviews = todays.filter(e => e.type === "pageview");
  const sessions = new Set(pageviews.map(e => e.session).filter(Boolean));

  const queueRaw = await env.INSPIRIT_KV.get("nova:queue");
  const queue = queueRaw ? JSON.parse(queueRaw) : [];
  const pending = queue.filter(q => q.status === "pending").length;

  return {
    today_revenue: orders.reduce((a, e) => a + (e.amount || 0), 0),
    today_orders: orders.length,
    today_visitors: sessions.size,
    today_pageviews: pageviews.length,
    pending_drafts: pending,
    crew_online: 2,
    crew_total: 8
  };
}

async function getActivity(env, limit = 20) {
  const list = await env.INSPIRIT_KV.list({ prefix: "activity:", limit });
  const items = (await Promise.all(
    list.keys.map(k => env.INSPIRIT_KV.get(k.name).then(v => v ? JSON.parse(v) : null))
  )).filter(Boolean);
  return items.sort((a, b) => b.ts - a.ts);
}

// ------------------------------------------------------------
// MAIN ROUTER
// ------------------------------------------------------------
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/" || path === "/api" || path === "/api/health") {
        return json({
          service: "Inspirit OS",
          version: "0.2.0",
          crew_online: ["sage", "nova"],
          time: new Date().toISOString()
        });
      }

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

      if (path === "/api/nova/draft" && request.method === "POST") {
        const { brief } = await request.json();
        if (!brief?.trim()) return json({ error: "brief required" }, 400);
        const result = await novaDraft(env, brief.trim());
        return json({ from: "nova", ...result });
      }

      if (path === "/api/nova/queue" && request.method === "GET") {
        const raw = await env.INSPIRIT_KV.get("nova:queue");
        return json({ queue: raw ? JSON.parse(raw) : [] });
      }

      if (path === "/api/nova/queue/update" && request.method === "POST") {
        const { id, status } = await request.json();
        const raw = await env.INSPIRIT_KV.get("nova:queue");
        const queue = raw ? JSON.parse(raw) : [];
        const item = queue.find(q => q.id === id);
        if (item) {
          item.status = status;
          item.reviewedAt = Date.now();
          await env.INSPIRIT_KV.put("nova:queue", JSON.stringify(queue));
        }
        return json({ ok: !!item });
      }

      if (path === "/api/track" && request.method === "POST") {
        const event = await request.json();
        await trackEvent(env, event);
        return json({ ok: true });
      }

      if (path === "/api/stats" && request.method === "GET") {
        return json(await getStats(env));
      }

      if (path === "/api/activity" && request.method === "GET") {
        const limit = parseInt(url.searchParams.get("limit") || "20");
        return json({ activity: await getActivity(env, limit) });
      }

      return json({ error: "not found", path }, 404);
    } catch (err) {
      console.error(err);
      return json({ error: err.message, stack: err.stack }, 500);
    }
  }
};
