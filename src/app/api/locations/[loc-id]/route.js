import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Update a location
export async function PUT(req) {
    try {
        const url = req.url;
        const loc_id = url.split("/").pop();

        if(!loc_id) {
            return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
        }

        const body = await req.json();
        const updatedLocation = await prisma.location.update({
            where: { location_id: Number(loc_id) },
            data: body
        });
        return NextResponse.json(updatedLocation);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Delete a location
export async function DELETE(req) {
    try {
        const url = req.url;
        const loc_id = url.split("/").pop();

        if(!loc_id) {
            return NextResponse.json({ error: "Location ID is required" }, { status: 400 });
        }

        await prisma.location.delete({
            where: { location_id: Number(loc_id) }
        });
        return NextResponse.json({ message: "Location deleted successfully" });
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}