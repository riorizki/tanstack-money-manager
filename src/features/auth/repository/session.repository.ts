import { prisma } from '@/shared/lib/prisma'
import { createHash } from 'node:crypto'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export const sessionRepository = {
  createSession(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.session.create({
      data: {
        ...data,
        tokenHash: hashToken(data.token),
      },
    })
  },

  findByToken(token: string) {
    return prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
    })
  },

  deleteSession(token: string) {
    return prisma.session.delete({
      where: { tokenHash: hashToken(token) },
    })
  },

  deleteExpired() {
    return prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  },
}
