import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
};

const prismadb = globalThis.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;