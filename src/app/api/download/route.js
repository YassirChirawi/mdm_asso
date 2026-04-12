import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    try {
        const { fileName } = await request.json();

        if (!fileName) {
            return NextResponse.json({ error: 'Missing fileName' }, { status: 400 });
        }

        const stats = await prisma.downloadStats.upsert({
            where: { fileName },
            update: { count: { increment: 1 } },
            create: { fileName, count: 1 },
        });

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Download tracking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
