require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to Prisma...");
        const newMessage = await prisma.message.create({
            data: {
                name: "Test Debug",
                email: "debug@test.com",
                subject: "Debug",
                message: "Testing local prisma connection"
            }
        });
        console.log("Success:", newMessage);
    } catch (e) {
        console.error("Prisma Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
