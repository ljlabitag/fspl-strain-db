import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Update a strain characteristic
export async function PUT(req) {
    try {
        const url = req.url;
        const strain_char_id = url.split('/').pop();

        const body = await req.json();
        const updatedCharacteristic = await prisma.strainCharacteristic.update({
            where: { id: Number(strain_char_id) },
            data: body
        });

        return NextResponse.json(updatedCharacteristic);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Delete a strain characteristic
export async function DELETE(req) {
    try {
        const url = req.url;
        const strain_char_id = url.split('/').pop();

        await prisma.strainCharacteristic.delete({
            where: { id: Number(strain_char_id) }
        });
        return NextResponse.json({ message: "Strain characteristic deleted successfully" });
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}