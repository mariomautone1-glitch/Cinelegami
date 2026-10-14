// CineLegami: piccolo servizio che tiene nascosta la chiave TMDB.
// La pagina chiede i dati a questo servizio, e il servizio li chiede a TMDB con la chiave.
//
// Da impostare nel pannello di Cloudflare (Settings, Variables and Secrets):
//   TMDB_KEY        tipo Secret   la tua chiave TMDB (API Key oppure Read Access Token)
//   ALLOWED_ORIGIN  tipo Text     https://TUO-UTENTE.github.io   (senza barra finale e senza nome del repository)

const OK_PATH = /^\/(search\/(movie|tv|person|multi)|movie\/(now_playing|upcoming)|(movie|tv)\/\d+|movie\/\d+\/credits|tv\/\d+\/aggregate_credits|person\/\d+|person\/\d+\/(movie_credits|combined_credits))$/;
const OK_PARAMS = ["query", "language", "include_adult", "page", "region"];

const json = (obj, status, extra) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "")
      .split(",")
      .map((s) => s.trim().replace(/\/$/, ""))
      .filter(Boolean);
    const originOk = !origin || allowed.length === 0 || allowed.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": origin && originOk ? origin : allowed[0] || "*",
      Vary: "Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...cors, "Access-Control-Allow-Methods": "GET", "Access-Control-Max-Age": "86400" },
      });
    }
    if (!originOk) return json({ error: "origine non consentita" }, 403, cors);
    if (request.method !== "GET") return json({ error: "metodo non consentito" }, 405, cors);

    const url = new URL(request.url);
    if (!OK_PATH.test(url.pathname)) return json({ error: "percorso non consentito" }, 404, cors);
    const key = (env.TMDB_KEY || "").trim();
    if (!key) return json({ error: "chiave non configurata" }, 500, cors);

    const target = new URL("https://api.themoviedb.org/3" + url.pathname);
    for (const name of OK_PARAMS) {
      if (url.searchParams.has(name)) target.searchParams.set(name, url.searchParams.get(name));
    }
    const headers = {};
    if (key.length > 60 && key.includes(".")) headers.Authorization = "Bearer " + key;
    else target.searchParams.set("api_key", key);

    const r = await fetch(target.toString(), { headers, cf: { cacheTtl: 86400, cacheEverything: true } });
    return new Response(await r.text(), {
      status: r.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": r.ok ? "public, max-age=3600" : "no-store",
        ...cors,
      },
    });
  },
};
