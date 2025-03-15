import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Update info for a specific strain
export async function PUT(req) {
    try {
        const url = req.url;
        const strain_id = url.split("/").pop();

        if (!strain_id) {
            return NextResponse.json({ error: "Missing strain ID" }, { status: 400 });
        }

        const body = await req.json();
        const updatedStrain = await prisma.strain.update({
            where: { strain_id: Number(strain_id) },
            data: body,
        });

        return NextResponse.json(updatedStrain);
    } 
    catch (error) {
        return NextResponse.json({ error: "Error updating strain" }, { status: 500 });
    }
}

// Delete a strain
export async function DELETE(req) {
    try {
        const url = req.url;
        const strain_id = url.split("/").pop();

        if (!strain_id) {
            return NextResponse.json({ error: "Missing strain ID" }, { status: 400 });
        }

        await prisma.strain.delete({
            where: { strain_id: Number(strain_id) },
        });

        return NextResponse.json({ message: "Strain deleted" });
    } 
    catch (error) {
        return NextResponse.json({ error: "Error deleting strain" }, { status: 500 });
    }
}
