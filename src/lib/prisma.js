import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Pas de repli sur un chemin local : sans DATABASE_URL on veut une erreur
    // claire au démarrage plutôt qu'une base fantôme sur le disque du dev.
    return new PrismaClient();
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
