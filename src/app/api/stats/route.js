import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileName = searchParams.get('file');

        if (!fileName) {
            return NextResponse.json({ error: 'Missing file param' }, { status: 400 });
        }

        const stats = await prisma.downloadStats.findUnique({
            where: { fileName },
        });

        return NextResponse.json({ count: stats ? stats.count : 0 });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
