#!/usr/bin/env node
/**
 * OpenNext node-middleware bundling copies
 *   .next/server/instrumentation.js.nft.json
 * → .next/standalone/.next/server/instrumentation.js.nft.json
 *
 * Next 16 may emit the source nft, then OpenNext copyFileSync still
 * ENOENTs if the standalone dest directory does not exist yet.
 * Always mkdir dest and write both sides.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const stub = `${JSON.stringify({ version: 1, files: [] })}\n`
const dirs = [
  join(root, '.next', 'server'),
  join(root, '.next', 'standalone', '.next', 'server'),
]

if (!existsSync(join(root, '.next'))) {
  console.log('ensure-nft: no .next directory, skip')
  process.exit(0)
}

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true })
  const nft = join(dir, 'instrumentation.js.nft.json')
  writeFileSync(nft, stub)
  console.log(`ensure-nft: wrote ${nft}`)
}
