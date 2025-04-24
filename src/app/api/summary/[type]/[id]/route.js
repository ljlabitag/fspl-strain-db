import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
    const { type, id } = await params;
    const body = await req.json();

    try {
        if (type === 'announcements') {
            const updated = await prisma.announcement.update({
                where: { announcement_id: parseInt(id) },
                data: { title: body.title, message: body.message },
            });
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { type, id } = await params;

    try {
        if (type === 'announcements') {
            await prisma.announcement.delete({
                where: { announcement_id: parseInt(id) },
            });
            return NextResponse.json({ message: 'Deleted successfully' });
        }
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
