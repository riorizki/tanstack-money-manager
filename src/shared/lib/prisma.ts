import { PrismaClient } from '../../generated/prisma/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { env } from '@/env'

function getMariaDbConfigFromDatabaseUrl(databaseUrl: string) {
  const parsed = new URL(databaseUrl)

  if (parsed.protocol !== 'mysql:' && parsed.protocol !== 'mariadb:') {
    throw new Error(
      `Unsupported DATABASE_URL protocol "${parsed.protocol}". Expected mysql:// or mariadb://`,
    )
  }

  const database = parsed.pathname.replace(/^\//, '')

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database,
  }
}

// Prisma CLI supports mysql:// URLs, while the MariaDB adapter expects its own
// connection format for URL strings. Parsing into pool config keeps both aligned.
const adapter = new PrismaMariaDb(
  getMariaDbConfigFromDatabaseUrl(env.DATABASE_URL),
)

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
