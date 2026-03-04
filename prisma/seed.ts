import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.session.deleteMany()

  const email = 'demo@moneymanager.local'
  const passwordHash = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Demo User',
      passwordHash,
    },
    create: {
      email,
      name: 'Demo User',
      passwordHash,
    },
  })

  console.log(`✅ Seeded auth demo user: ${user.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
