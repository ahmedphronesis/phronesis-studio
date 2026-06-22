import { PrismaClient } from '@prisma/client'

// Debug: log DATABASE_URL state at module load
const dbUrl = process.env.DATABASE_URL
console.log('[db] DATABASE_URL loaded:', dbUrl ? `YES (${dbUrl.substring(0, 25)}...)` : 'NO')

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db