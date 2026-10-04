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
          const ck = new Request("https://cache.blagoday/tr2/" + encodeURIComponent(target) + "/" + (await sha256(text)));
          const hit = await caches.default.match(ck);
          if (hit) { const j = await hit.json(); out.push({ id: it.id, ...j }); continue; }
          let res = { text, lang: "" };
          try {
            const r = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8-fast", {
              messages: [
                { role: "system", content: "You are a professional translator for a music website. Detect the language of the user's text and translate it into " + target + ". Keep names, emojis and the tone. Reply ONLY with compact JSON: {\"lang\":\"<ISO 639-1 code of the source language>\",\"text\":\"<translation>\"}. If the text is already in " + target + ", return it unchanged." },
                { role: "user", content: text },
              ],
              max_tokens: 700, temperature: 0.2,
            });
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
          } catch (e) { res = { text, lang: "", error: "ai" }; }
          out.push({ id: it.id, ...res });
        }
        return json(out);
      }
      if (p === "/") return json({ ok: true, service: "blagoday-soundcloud", v: 3 });
      return json({ error: "not_found" }, 404);
    } catch (e) {
      return json({ error: "server", message: String(e && e.message || e) }, 500);
    }
  },
};
