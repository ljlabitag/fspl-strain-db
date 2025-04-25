import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req, { params }) {
    const { type } = await params;

    try {
        const body = await req.json();

        if (type === 'announcements') {
            const newAnnouncement = await prisma.announcement.create({
                data: {
                    title: body.title,
                    message: body.message,
                },
            });
            return NextResponse.json(newAnnouncement, { status: 201 });
        }

        return NextResponse.json({ error: 'Unsupported type for POST' }, { status: 400 });
    } catch (error) {
        console.error('POST /summary/[type] error:', error);
        return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
    }
}
