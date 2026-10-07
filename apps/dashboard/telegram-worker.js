/**
 * Zero-dep Telegram webhook for the existing Cloudflare worker named `aeon`.
 * Relays updates to GitHub repository_dispatch (Aeon Messages workflow).
 */
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("aeon telegram webhook: ok", { status: 200 });
    }
    if (
      !env.TELEGRAM_WEBHOOK_SECRET ||
      !(await secretEquals(
        request.headers.get("x-telegram-bot-api-secret-token") || "",
        env.TELEGRAM_WEBHOOK_SECRET,
      ))
    ) {
      return new Response("forbidden", { status: 403 });
    }
    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("bad request", { status: 400 });
    }
    const dedupeKey =
      typeof update?.update_id === "number" ? `update:${update.update_id}` : null;
    if (dedupeKey && env.REPLAY_GUARD && (await env.REPLAY_GUARD.get(dedupeKey)) !== null) {
      return new Response("duplicate", { status: 200 });
    }
    const response = await handleUpdate(env, update);
    if (dedupeKey && env.REPLAY_GUARD && response.status === 200) {
      ctx.waitUntil(env.REPLAY_GUARD.put(dedupeKey, "1", { expirationTtl: 300 }));
    }
    return response;
  },
};

async function handleUpdate(env, update) {
  const owner = String(env.TELEGRAM_CHAT_ID);
  const ownerUid = String(env.TELEGRAM_ALLOWED_USER_ID || env.TELEGRAM_CHAT_ID);
  const cb = update?.callback_query;
  if (cb) {
    await answerCallback(env, cb.id);
    if (String(cb.message?.chat?.id) !== owner || String(cb.from?.id) !== ownerUid) {
      return new Response("ignored", { status: 200 });
    }
    return dispatch(env, "telegram-callback", {
      data: cb.data,
      from_id: cb.from?.id,
      chat_id: cb.message?.chat?.id,
      message_id: cb.message?.message_id,
    });
  }
  const message = update?.message;
  if (!message?.text) return new Response("ignored", { status: 200 });
  if (String(message.chat?.id) !== owner || String(message.from?.id) !== ownerUid) {
    if (message.chat?.type === "private" && String(message.chat?.id) !== owner) {
      await sendMessage(env, message.chat.id, "This bot is private.");
    }
    return new Response("ignored", { status: 200 });
  }
  const replyTo = message.reply_to_message?.text;
  const base = { from_id: message.from?.id, chat_id: message.chat.id };
  if (replyTo && /\[[A-Za-z0-9_-]+::[A-Za-z0-9_-]+\]/.test(replyTo)) {
    return dispatch(env, "telegram-reply", { ...base, reply_to_text: replyTo, text: message.text });
  }
  if (message.text.startsWith("/")) {
    return dispatch(env, "telegram-command", { ...base, text: message.text });
  }
  return dispatch(env, "telegram-message", {
    ...base,
    message: message.text,
    update_id: update.update_id,
  });
}

async function secretEquals(a, b) {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(da);
  const y = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

async function dispatch(env, eventType, clientPayload) {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "aeon-telegram-webhook",
    },
    body: JSON.stringify({ event_type: eventType, client_payload: clientPayload }),
  });
  if (!res.ok) return new Response(`dispatch failed: ${res.status}`, { status: 502 });
  return new Response("ok", { status: 200 });
}

async function answerCallback(env, callbackQueryId) {
  if (!callbackQueryId) return;
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId }),
    });
  } catch { /* ignore */ }
}

async function sendMessage(env, chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch { /* ignore */ }
}
