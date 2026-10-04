// Blagoday SoundCloud bridge (Cloudflare Worker) v2
// Vars: SC_CLIENT_ID, SC_CLIENT_SECRET
const SITE = "https://blagodey.github.io";
const AUTH = "https://secure.soundcloud.com/authorize";
const TOKEN = "https://secure.soundcloud.com/oauth/token";
const API = "https://api.soundcloud.com";
const ARTIST = "1375144858"; // Blagoday Music

const cors = () => ({
  "Access-Control-Allow-Origin": SITE,
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Authorization,Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
});
const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json", ...cors(), ...extra } });

const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const rand = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const sha256 = async (s) => b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
const getCookie = (req, k) => {
  const m = (req.headers.get("Cookie") || "").match(new RegExp("(?:^|; )" + k + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : "";
};
const safeReturn = (u) => (u && u.startsWith(SITE + "/") ? u : SITE + "/blagoday-production/");

async function tokenReq(env, params) {
  const body = new URLSearchParams({ client_id: env.SC_CLIENT_ID, client_secret: env.SC_CLIENT_SECRET, ...params });
  const r = await fetch(TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", accept: "application/json; charset=utf-8" },
    body,
  });
  const t = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, t };
}

// App token (client credentials), cached in the edge cache
async function appToken(env) {
  const cache = caches.default, key = new Request("https://cache.blagoday/app-token-v1");
  const hit = await cache.match(key);
  if (hit) { const j = await hit.json(); if (j.exp > Date.now() + 60000) return j.at; }
  const r = await fetch(TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", accept: "application/json; charset=utf-8",
      Authorization: "Basic " + btoa(env.SC_CLIENT_ID + ":" + env.SC_CLIENT_SECRET),
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  const t = await r.json().catch(() => ({}));
  if (!t.access_token) throw new Error("app_token_failed");
  const ttl = Math.max(300, (t.expires_in || 3600) - 120);
  await cache.put(key, new Response(JSON.stringify({ at: t.access_token, exp: Date.now() + ttl * 1000 }), { headers: { "Cache-Control": "max-age=" + ttl } }));
  return t.access_token;
}

// Public read with app token + edge cache
async function pub(env, ctx, path, maxAge, shape) {
  const cache = caches.default, key = new Request("https://cache.blagoday/pub2" + path);
  const hit = await cache.match(key);
  if (hit) return new Response(hit.body, { headers: { "Content-Type": "application/json", ...cors(), "X-Cache": "HIT" } });
  const at = await appToken(env);
  const r = await fetch(API + path, { headers: { accept: "application/json; charset=utf-8", Authorization: "OAuth " + at } });
  if (!r.ok) return json({ error: "upstream", status: r.status }, r.status);
  const data = shape(await r.json());
  const body = JSON.stringify(data);
  ctx.waitUntil(cache.put(key, new Response(body, { headers: { "Cache-Control": "max-age=" + maxAge } })));
  return new Response(body, { headers: { "Content-Type": "application/json", ...cors(), "X-Cache": "MISS" } });
}
const list = (j) => (Array.isArray(j) ? j : j.collection || []);

// Calls on behalf of the signed-in listener
async function scApi(req, path, init = {}) {
  const auth = req.headers.get("Authorization") || "";
  if (!/^OAuth \S+$/.test(auth)) return json({ error: "login_required" }, 401);
  const r = await fetch(API + path, {
    ...init,
    headers: { accept: "application/json; charset=utf-8", Authorization: auth, ...(init.headers || {}) },
  });
  const txt = await r.text();
  let data;
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { raw: txt.slice(0, 300) }; }
  return json(data, r.status);
}


// ================= Durable Object: chat + site data =================
const BAD = /(https?:\/\/|www\.)\S+/i;
export class ChatRoom {
  constructor(state, env) {
    this.state = state; this.env = env; this.sql = state.storage.sql; this.rate = new Map();
    this.sql.exec(`CREATE TABLE IF NOT EXISTS msgs(id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER, name TEXT, avatar TEXT, uid TEXT, author INTEGER, text TEXT, deleted INTEGER DEFAULT 0)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS plays(slug TEXT PRIMARY KEY, n INTEGER)`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS visits(day TEXT PRIMARY KEY, n INTEGER)`);
  }
  rows(q, ...a) { return [...this.sql.exec(q, ...a)]; }
  limited(key, ms) { const now = Date.now(), last = this.rate.get(key) || 0; if (now - last < ms) return true; this.rate.set(key, now); if (this.rate.size > 5000) this.rate.clear(); return false; }
  online() { return this.state.getWebSockets().length; }
  broadcast(obj) { const s = JSON.stringify(obj); for (const ws of this.state.getWebSockets()) { try { ws.send(s); } catch {} } }
  history() { return this.rows(`SELECT id,ts,name,avatar,author,text FROM msgs WHERE deleted=0 ORDER BY id DESC LIMIT 80`).reverse(); }
  async fetch(req) {
    const url = new URL(req.url), p = url.pathname, ip = req.headers.get("X-IP") || "?";
    const ok = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
    if (p === "/ws") {
      if (req.headers.get("Upgrade") !== "websocket") return ok({ error: "upgrade" }, 426);
      const pair = new WebSocketPair();
      this.state.acceptWebSocket(pair[1]);
      pair[1].serializeAttachment({ ip, name: "", avatar: "", uid: "", author: 0 });
      pair[1].send(JSON.stringify({ type: "hist", msgs: this.history(), online: this.online() }));
      this.broadcast({ type: "online", n: this.online() });
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    if (p === "/history") return ok({ msgs: this.history(), online: this.online() });
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    if (p === "/play") {
      const slug = String(body.slug || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 120);
      if (!slug || this.limited("pl:" + ip + slug, 60000)) return ok({ ok: true });
      this.sql.exec(`INSERT INTO plays(slug,n) VALUES(?,1) ON CONFLICT(slug) DO UPDATE SET n=n+1`, slug);
      return ok({ ok: true });
    }
    if (p === "/visit") {
      if (this.limited("v:" + ip, 6 * 3600000)) return ok({ ok: true });
      const day = new Date().toISOString().slice(0, 10);
      this.sql.exec(`INSERT INTO visits(day,n) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET n=n+1`, day);
      return ok({ ok: true });
    }
    if (p === "/admin") {
      return ok({
        plays: this.rows(`SELECT slug,n FROM plays ORDER BY n DESC LIMIT 200`),
        visits: this.rows(`SELECT day,n FROM visits ORDER BY day DESC LIMIT 60`),
        chat: this.rows(`SELECT COUNT(*) AS n FROM msgs WHERE deleted=0`)[0],
        online: this.online(),
      });
    }
    return ok({ error: "not_found" }, 404);
  }
  async webSocketMessage(ws, raw) {
    let m; try { m = JSON.parse(raw); } catch { return; }
    const me = ws.deserializeAttachment() || {};
    if (m.type === "hello") {
      if (m.token) {
        try {
          const r = await fetch(API + "/me", { headers: { accept: "application/json; charset=utf-8", Authorization: "OAuth " + String(m.token).slice(0, 4000) } });
          if (r.ok) { const u = await r.json(); Object.assign(me, { name: u.username || "", avatar: u.avatar_url || "", uid: String(u.id || ""), author: String(u.id) === ARTIST ? 1 : 0, sc: 1 }); }
          else me.dbg = "me " + r.status + " " + (await r.text()).slice(0, 120);
        } catch (e) { me.dbg = "ex " + String(e && e.message || e).slice(0, 120); }
      }
      if (!me.sc) me.name = String(m.name || "").replace(/[<>]/g, "").trim().slice(0, 32);
      ws.serializeAttachment(me);
      ws.send(JSON.stringify({ type: "me", name: me.name, author: me.author, sc: !!me.sc, dbg: me.dbg || "" }));
      return;
    }
    if (m.type === "msg") {
      const text = String(m.text || "").replace(/\s+\n/g, "\n").trim().slice(0, 600);
      if (!text) return;
      if (!me.name) { ws.send(JSON.stringify({ type: "err", e: "name" })); return; }
      if (!me.author && this.limited("msg:" + (me.uid || me.ip), 4000)) { ws.send(JSON.stringify({ type: "err", e: "slow" })); return; }
      if (!me.sc && BAD.test(text)) { ws.send(JSON.stringify({ type: "err", e: "link" })); return; }
      const ts = Date.now();
      this.sql.exec(`INSERT INTO msgs(ts,name,avatar,uid,author,text) VALUES(?,?,?,?,?,?)`, ts, me.name, me.avatar || "", me.uid || "", me.author ? 1 : 0, text);
      const id = this.rows(`SELECT last_insert_rowid() AS id`)[0].id;
      this.broadcast({ type: "msg", m: { id, ts, name: me.name, avatar: me.avatar || "", author: me.author ? 1 : 0, text } });
      return;
    }
    if (m.type === "del" && me.author) {
      this.sql.exec(`UPDATE msgs SET deleted=1 WHERE id=?`, Number(m.id) || 0);
      this.broadcast({ type: "del", id: Number(m.id) || 0 });
    }
  }
  async webSocketClose(ws) { try { ws.close(); } catch {} this.broadcast({ type: "online", n: Math.max(0, this.online() - 1) }); }
  async webSocketError(ws) { try { ws.close(); } catch {} }
}

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const p = url.pathname, M = req.method;
    if (M === "OPTIONS") return new Response(null, { status: 204, headers: cors() });
    const redirectUri = url.origin + "/callback";
    let m;
    try {
      // ---- sign-in (OAuth 2.1 + PKCE) ----
      if (p === "/login") {
        const verifier = rand(48), state = rand(16);
        const ret = safeReturn(url.searchParams.get("return") || "");
        const q = new URLSearchParams({
          client_id: env.SC_CLIENT_ID, redirect_uri: redirectUri, response_type: "code",
          code_challenge: await sha256(verifier), code_challenge_method: "S256", state,
        });
        const ck = (k, v) => `${k}=${encodeURIComponent(v)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
        const h = new Headers({ Location: AUTH + "?" + q });
        h.append("Set-Cookie", ck("pkce", verifier));
        h.append("Set-Cookie", ck("st", state));
        h.append("Set-Cookie", ck("ret", ret));
        return new Response(null, { status: 302, headers: h });
      }
      if (p === "/callback") {
        const code = url.searchParams.get("code"), state = url.searchParams.get("state");
        const ret = safeReturn(getCookie(req, "ret"));
        if (!code || !state || state !== getCookie(req, "st")) return Response.redirect(ret + "#sc_err=state", 302);
        const { ok, t } = await tokenReq(env, {
          grant_type: "authorization_code", redirect_uri: redirectUri, code, code_verifier: getCookie(req, "pkce"),
        });
        if (!ok || !t.access_token) return Response.redirect(ret + "#sc_err=token", 302);
        const frag = new URLSearchParams({ sc_at: t.access_token, sc_rt: t.refresh_token || "", sc_exp: String(Date.now() + (t.expires_in || 3600) * 1000) });
        const h = new Headers({ Location: ret + "#" + frag });
        for (const k of ["pkce", "st", "ret"]) h.append("Set-Cookie", `${k}=; Path=/; Max-Age=0; Secure; SameSite=Lax`);
        return new Response(null, { status: 302, headers: h });
      }
      if (p === "/refresh" && M === "POST") {
        const { refresh_token } = await req.json().catch(() => ({}));
        if (!refresh_token) return json({ error: "no_refresh_token" }, 400);
        const { ok, status, t } = await tokenReq(env, { grant_type: "refresh_token", refresh_token });
        if (!ok) return json({ error: "refresh_failed" }, status);
        return json({ access_token: t.access_token, refresh_token: t.refresh_token || "", expires_at: Date.now() + (t.expires_in || 3600) * 1000 });
      }

      // ---- public data (no sign-in) ----
      if (p === "/catalog") {
        return pub(env, ctx, `/users/${ARTIST}/tracks?limit=200&linked_partitioning=true`, 1800, (j) =>
          list(j).map((t) => ({
            id: t.id, title: t.title, permalink: t.permalink || (t.permalink_url || "").split("?")[0].split("/").pop(), art: t.artwork_url || "",
            created: t.created_at, dur: Math.round((t.duration || 0) / 1000), plays: t.playback_count || 0,
            likes: t.favoritings_count ?? t.likes_count ?? 0, comments: t.comment_count || 0, genre: t.genre || "",
          })));
      }
      if ((m = p.match(/^\/comments\/(\d+)$/))) {
        return pub(env, ctx, `/tracks/${m[1]}/comments?limit=50&linked_partitioning=true`, 120, (j) =>
          list(j).map((c) => ({ body: c.body, ts: c.timestamp, at: c.created_at, user: c.user ? { name: c.user.username, avatar: c.user.avatar_url, url: c.user.permalink_url } : null })));
      }
      if ((m = p.match(/^\/likers\/(\d+)$/))) {
        return pub(env, ctx, `/tracks/${m[1]}/favoriters?limit=24&linked_partitioning=true`, 300, (j) =>
          list(j).map((u) => ({ name: u.username, avatar: u.avatar_url, url: u.permalink_url })));
      }
      if (p === "/artist") {
        return pub(env, ctx, `/users/${ARTIST}`, 600, (u) => ({ id: u.id, name: u.username, followers: u.followers_count, tracks: u.track_count, avatar: u.avatar_url }));
      }
      if (p === "/resolve") {
        const target = url.searchParams.get("url") || "";
        if (!/^https:\/\/soundcloud\.com\/blagodaymusic\//.test(target)) return json({ error: "bad_url" }, 400);
        return pub(env, ctx, `/resolve?url=${encodeURIComponent(target)}`, 86400, (o) => ({ id: o.id, kind: o.kind, title: o.title }));
      }

      // ---- actions as the signed-in listener ----
      if (p === "/me") return scApi(req, "/me");
      if (p === "/follow") {
        if (M === "GET") return scApi(req, `/me/followings/${ARTIST}`);
        if (M === "PUT" || M === "POST") return scApi(req, `/me/followings/${ARTIST}`, { method: "PUT" });
        if (M === "DELETE") return scApi(req, `/me/followings/${ARTIST}`, { method: "DELETE" });
      }
      if ((m = p.match(/^\/like\/(\d+)$/))) {
        if (M === "POST") return scApi(req, `/likes/tracks/${m[1]}`, { method: "POST" });
        if (M === "DELETE") return scApi(req, `/likes/tracks/${m[1]}`, { method: "DELETE" });
      }
      if ((m = p.match(/^\/likepl\/(\d+)$/))) {
        if (M === "POST") return scApi(req, `/likes/playlists/${m[1]}`, { method: "POST" });
        if (M === "DELETE") return scApi(req, `/likes/playlists/${m[1]}`, { method: "DELETE" });
      }
      if ((m = p.match(/^\/repost\/(\d+)$/))) {
        if (M === "POST") return scApi(req, `/reposts/tracks/${m[1]}`, { method: "POST" });
        if (M === "DELETE") return scApi(req, `/reposts/tracks/${m[1]}`, { method: "DELETE" });
      }
      if ((m = p.match(/^\/comment\/(\d+)$/)) && M === "POST") {
        const { body, timestamp } = await req.json().catch(() => ({}));
        const text = String(body || "").trim().slice(0, 1000);
        if (!text) return json({ error: "empty" }, 400);
        const c = { body: text };
        if (Number.isFinite(+timestamp) && +timestamp >= 0) c.timestamp = Math.floor(+timestamp);
        const res = await scApi(req, `/tracks/${m[1]}/comments`, {
          method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ comment: c }),
        });
        if (res.ok) ctx.waitUntil(caches.default.delete(new Request(`https://cache.blagoday/pub2/tracks/${m[1]}/comments?limit=50&linked_partitioning=true`)));
        return res;
      }


      // ---- translation (Workers AI) ----
      if (p === "/translate" && M === "POST") {
        const origin = req.headers.get("Origin") || "";
        if (origin !== SITE) return json({ error: "forbidden" }, 403);
        const { items, to } = await req.json().catch(() => ({}));
        const target = String(to || "English").slice(0, 40);
        if (!Array.isArray(items) || !items.length) return json({ error: "empty" }, 400);
        const out = [];
        for (const it of items.slice(0, 20)) {
          const text = String(it && it.text || "").slice(0, 1200);
          if (!text.trim()) { out.push({ id: it && it.id, text: "", lang: "" }); continue; }
          const ck = new Request("https://cache.blagoday/tr4/" + encodeURIComponent(target) + "/" + (await sha256(text)));
          const hit = await caches.default.match(ck);
          if (hit) { const j = await hit.json(); out.push({ id: it.id, ...j }); continue; }
          let res = { text, lang: "" };
          try {
            const sys = "You are a professional translator for a music website. Detect the language of the text and translate it into " + target + ". Keep names, emojis and the tone. Reply ONLY with compact JSON: {\"lang\":\"<ISO 639-1 code of the source language>\",\"text\":\"<translation>\"}. If the text is already in " + target + ", return it unchanged.";
            let r = null, lastErr = "";
            for (const model of (env.TR_MODELS || "@cf/mistralai/mistral-small-3.1-24b-instruct,@cf/google/gemma-3-12b-it,@cf/meta/llama-3.1-8b-instruct-fp8-fast").split(",")) {
              try {
                r = await env.AI.run(model, { messages: [{ role: "user", content: sys + "\n\nTEXT:\n" + text }], max_tokens: 700, temperature: 0.2 });
                if (r) break;
              } catch (e) { lastErr = model + ": " + String(e && e.message || e).slice(0, 200); }
            }
            if (!r) throw new Error(lastErr);
            const resp = r && (r.response ?? (r.result && r.result.response));
            let j = null;
            if (resp && typeof resp === "object") j = resp;
            else {
              const raw = String(resp || "").trim();
              const mm = raw.match(/\{[\s\S]*\}/);
              if (mm) { try { j = JSON.parse(mm[0]); } catch {} }
              if (!j && raw) j = { text: raw, lang: "" };
            }
            if (j && typeof j.text === "string" && j.text.trim()) res = { text: j.text, lang: String(j.lang || "").slice(0, 8) };
            ctx.waitUntil(caches.default.put(ck, new Response(JSON.stringify(res), { headers: { "Cache-Control": "max-age=2592000" } })));
          } catch (e) { res = { text, lang: "", error: "ai", detail: String(e && e.message || e).slice(0, 300) }; }
          out.push({ id: it.id, ...res });
        }
        return json(out);
      }

      // ---- chat + site data (Durable Object) ----
      if (p.startsWith("/chat/") || ["/play", "/visit"].includes(p)) {
        const stub = env.CHAT.get(env.CHAT.idFromName("main"));
        const sub = p.startsWith("/chat/") ? p.slice(5) : p;
        const h = new Headers(req.headers); h.set("X-IP", req.headers.get("CF-Connecting-IP") || "?");
        if (sub !== "/ws" && sub !== "/history" && (req.headers.get("Origin") || "") !== SITE) return json({ error: "forbidden" }, 403);
        const r = await stub.fetch(new Request("https://do" + sub, { method: req.method, headers: h, body: req.method === "POST" ? await req.text() : undefined }));
        if (sub === "/ws") return r;
        return new Response(r.body, { status: r.status, headers: { "Content-Type": "application/json", ...cors() } });
      }
      if (p === "/admin") {
        const auth = req.headers.get("Authorization") || "";
        const me = await fetch(API + "/me", { headers: { accept: "application/json; charset=utf-8", Authorization: auth } });
        if (!me.ok) return json({ error: "login_required" }, 401);
        const u = await me.json();
        if (String(u.id) !== ARTIST) return json({ error: "forbidden" }, 403);
        const stub = env.CHAT.get(env.CHAT.idFromName("main"));
        const r = await stub.fetch(new Request("https://do/admin"));
        return new Response(r.body, { status: r.status, headers: { "Content-Type": "application/json", ...cors() } });
      }
      if (p === "/") return json({ ok: true, service: "blagoday-soundcloud", v: 4 });
      return json({ error: "not_found" }, 404);
    } catch (e) {
      return json({ error: "server", message: String(e && e.message || e) }, 500);
    }
  },
};
