const enc = new TextEncoder();
const TOKEN_KEY = "github_pat_enc";
const SESSION_SECONDS = 365 * 24 * 60 * 60;
const OWNER = "danielmusagara-hash";
const REPO = "musagara-daniel-website";

function b64u(bytes) {
  let s = ""; for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function unb64u(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}
async function hmac(data, secret) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
async function deriveKey(secret) {
  const raw = await crypto.subtle.digest("SHA-256", enc.encode(secret));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt","decrypt"]);
}
async function encryptToken(token, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(secret);
  const ciphertext = await crypto.subtle.encrypt({name:"AES-GCM",iv}, key, enc.encode(token));
  return b64u(iv) + "." + b64u(ciphertext);
}
async function decryptToken(value, secret) {
  const [iv, data] = value.split(".");
  const key = await deriveKey(secret);
  const plain = await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64u(iv)}, key, unb64u(data));
  return new TextDecoder().decode(plain);
}
function cookieValue(request) {
  const raw = request.headers.get("Cookie") || "";
  const item = raw.split(";").map(x=>x.trim()).find(x=>x.startsWith("dtech_admin="));
  return item ? item.slice("dtech_admin=".length) : "";
}
async function makeSession(secret) {
  const payload = b64u(enc.encode(JSON.stringify({exp:Math.floor(Date.now()/1000)+SESSION_SECONDS})));
  return payload + "." + b64u(await hmac(payload, secret));
}
async function validSession(request, secret) {
  const value = cookieValue(request);
  if (!value || !secret) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = b64u(await hmac(payload, secret));
  if (expected !== signature) return false;
  try { return JSON.parse(new TextDecoder().decode(unb64u(payload))).exp > Math.floor(Date.now()/1000); }
  catch { return false; }
}
function json(data, status=200, headers={}) {
  return new Response(JSON.stringify(data), {status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});
}
function cookie(session) {
  return `dtech_admin=${session}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}
async function githubToken(env) {
  const stored = await env.ADMIN_KV.get(TOKEN_KEY);
  if (!stored) throw new Error("Aucun jeton GitHub n’est encore configuré.");
  return decryptToken(stored, env.SESSION_SECRET);
}
async function handleApi(request, env) {
  if (!env.ADMIN_KV || !env.SESSION_SECRET) return json({error:"Configuration serveur incomplète : ajoute le KV ADMIN_KV et le secret SESSION_SECRET."},503);
  const url = new URL(request.url);
  if (url.pathname === "/api/auth/session" && request.method === "GET") {
    return json({authenticated: await validSession(request, env.SESSION_SECRET)});
  }
  if (url.pathname === "/api/auth/setup" && request.method === "POST") {
    const body = await request.json().catch(()=>({}));
    const token = String(body.token || "").trim();
    if (!token || token.length > 500) return json({error:"Jeton manquant ou invalide."},400);
    const check = await fetch("https://api.github.com/user", {headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"DTECH-Website-Admin"}});
    if (!check.ok) return json({error:"GitHub n’a pas accepté ce jeton. Vérifie ses droits et sa validité."},401);
    const existing = await env.ADMIN_KV.get(TOKEN_KEY);
    if (existing) {
      const current = await decryptToken(existing, env.SESSION_SECRET);
      if (current !== token) return json({error:"Un jeton est déjà configuré. Pour le remplacer, effectue une rotation contrôlée du secret."},403);
    } else {
      const repoCheck = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {headers:{Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"DTECH-Website-Admin"}});
      if (!repoCheck.ok) return json({error:"Ce jeton n’a pas accès au dépôt du site."},403);
      await env.ADMIN_KV.put(TOKEN_KEY, await encryptToken(token, env.SESSION_SECRET));
    }
    const session = await makeSession(env.SESSION_SECRET);
    return json({ok:true},200,{"Set-Cookie":cookie(session)});
  }
  if (!await validSession(request, env.SESSION_SECRET)) return json({error:"Session expirée. Reconnecte-toi avec ton jeton GitHub."},401);
  if (url.pathname === "/api/github" && ["GET","PUT"].includes(request.method)) {
    const owner=url.searchParams.get("owner"), repo=url.searchParams.get("repo");
    const branch=url.searchParams.get("branch") || "main";
    const path=url.searchParams.get("path") || "";
    if(owner!==OWNER || repo!==REPO) return json({error:"Dépôt non autorisé."},403);
    if(!/^(site-edits\.json|assets\/[A-Za-z0-9._-]+)$/.test(path) || path.includes("..")) return json({error:"Chemin de fichier non autorisé."},400);
    if(branch!=="main") return json({error:"Seule la branche main est autorisée."},400);
    const token=await githubToken(env);
    const ghUrl=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    const headers={Authorization:`Bearer ${token}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","User-Agent":"DTECH-Website-Admin"};
    if(request.method==="GET"){
      const r=await fetch(`${ghUrl}?ref=${encodeURIComponent(branch)}`,{headers});
      return new Response(await r.text(),{status:r.status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
    }
    const body=await request.json().catch(()=>null);
    if(!body || typeof body.content!=="string") return json({error:"Contenu de fichier invalide."},400);
    const payload={message:String(body.message||"Mise à jour du site DTECH").slice(0,120),content:body.content,branch};
    if(body.sha) payload.sha=body.sha;
    const r=await fetch(ghUrl,{method:"PUT",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify(payload)});
    return new Response(await r.text(),{status:r.status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"}});
  }
  return json({error:"Route API introuvable."},404);
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    return env.ASSETS.fetch(request);
  }
};
