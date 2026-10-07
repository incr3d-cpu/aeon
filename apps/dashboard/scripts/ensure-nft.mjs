#!/usr/bin/env node
/**
 * OpenNext (@opennextjs/aws copyTracedFiles) always copies
 * .next/server/instrumentation.js.nft.json when bundling Node middleware.
 * Next 16 webpack traces pages but often does not emit an nft file for
 * instrumentation.ts — even after a successful `next build --webpack`.
 * Stub the missing nft so Cloudflare Workers Builds can finish.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const serverDir = join(root, '.next', 'server')
const nftPath = join(serverDir, 'instrumentation.js.nft.json')

if (!existsSync(join(root, '.next'))) {
  console.log('ensure-nft: no .next directory, skip')
  process.exit(0)
}

mkdirSync(serverDir, { recursive: true })

if (!existsSync(nftPath)) {
  writeFileSync(nftPath, `${JSON.stringify({ version: 1, files: [] })}\n`)
  console.log(`ensure-nft: stubbed ${nftPath}`)
} else {
  console.log('ensure-nft: instrumentation.js.nft.json already present')
}
