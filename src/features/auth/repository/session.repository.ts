import { prisma } from '@/shared/lib/prisma'

export const sessionRepository = {
  createSession(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.session.create({ data })
  },

  findByToken(token: string) {
    return prisma.session.findUnique({ where: { token } })
  },

  deleteSession(token: string) {
    return prisma.session.delete({ where: { token } })
  },

  deleteExpired() {
    return prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  },
}
