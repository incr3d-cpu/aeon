# Long-term Memory
*Last consolidated: 2026-10-08*

## About This Repo
- Instance `incr3d-cpu/aeon`. Grok via X-account login. Telegram is the live channel.
- Operator goal (draft, from `soul/SOUL.md`): a crypto desk for the operator and Lippit. Catch narratives and low-cap runners early — dev, socials, chatter, meme, upside. Narratives rotate fast (v4 hooks, agent launchpads, stock-paired memes, prediction markets).
- Instant webhook `aeon.incr3d.workers.dev`. Live desk is the **group**. Bot `@PmarcaTrenchingBot`.
- Inbound only on `/command`, `@PmarcaTrenchingBot`, or reply-to-bot.

## Setup
- Infra is up (onboard 2026-10-08: 12 pass, 0 fail). Heartbeat daily 08:00 UTC. `fetch-tweets` daily 17:00 UTC on low-cap Solana/Base/Robinhood/Ethereum narratives.
- Operator said setup is not finished (2026-10-08). Open: market skills still off: `token-movers`, `narrative-tracker`, `investigation-report`.

## Operators (Telegram)

| Who | User id | Tag | Role |
|-----|---------|-----|------|
| Mathieu | 5021587553 | @biberoni | operator |
| Lippit | 1307960296 | @lippit1 | operator |
| Cetardio | 8725715639 | @cetardio | analysis partner — Aeon should @ them on CA / memecoin work so they can discuss in-thread |

`TELEGRAM_ALLOWED_USER_ID` is the comma-separated list of those three ids (GitHub secret+var and Cloudflare Worker).

## Operator notes
- Desk for the operator and Lippit (@0xlippit). Job is catching crypto narratives and low-cap runners early. $AEON is Base `0xbf8e8f0e8866a7052f948c16508644347c57aba3` (hook marketplace + mandatory audit, live since 2026-09-09 at aeon.fun/hooks).
- 2026-10-08 — operator: "They borrowed it from us." SuperHooks ($SHOOKS, Robinhood `0x9de495b746417346e7ccfffe625de0e0189297ac`) cloned the one-prompt hook builder and ships unaudited. Headen ($HEADEN, Arc `0xbe85de8d750b911bc5320dc3a89089dd8112f57a`) opened the account the same day with a clause launchpad; their own docs still say the contracts are not deployed. Hookr ($HOOKR, `0x18e674231a58c239dc7daedcffe15ec3a24cff5c`, ~$18M, green) and Programmable ($V4, `0xc60ba256b44334a0cd2c7242e98b88f031abb006`, ~$3.9M, down hard) already own the Robinhood hook-launchpad flow. Copies validate the category. Volume is on Hookr.

## Active context
- Operator + Lippit, crypto P&L. 2026-10-08 they said the last attempt was not good enough and left the next one open. No ticker or CA was attached. Ask for it before writing a post-mortem.
- Tape pointer (2026-10-08, PANews meme daily): size sat in Base $XDP and Robinhood Chain $NVDA. Detail in `memory/logs/2026-10-08.md`.
- 2026-10-08: FOMO the app (fomo.family), not a ticker. Copy-flow is the exit. 30d fees $28.68M / volume $5.47B; heat has rotated back to Solana. See [FOMO](/topics/fomo.md).

## Lessons Learned
- A miss with no ticker is a request for the next setup. Log the stance, map where size is, and get the CA before autopsying the last one.
- Do not LLM every group line — it floods Actions and the bot looks dead.
- Tag with @username so Telegram notifies. On a CA ask: tag the asker + @cetardio, then conclude.

## Next Priorities
- When they send a CA: dev, holders, narrative, exit liquidity, and whether that lane is still bid.
- Until then, hunt the live bid (stock-paired leaders on Base / Robinhood Chain) and treat fresh copycats as the trap.
- After they confirm, enable `token-movers`, `narrative-tracker`, and on-demand `investigation-report`
