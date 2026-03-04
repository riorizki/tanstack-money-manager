import { prisma } from '@/shared/lib/prisma'

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },

  create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({ data })
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({ where: { id }, data: { passwordHash } })
  },
}
