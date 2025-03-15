import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update ALL info of a personnel
export async function PUT(req) {
    try {
        const url = req.url;
        const person_id = url.split('/').pop();
  
        if (!person_id) {
            return NextResponse.json({ error: "Missing person_id parameter" }, { status: 400 });
        }
  
        const body = await req.json();
        const updatedPersonnel = await prisma.personnel.update({
            where: { person_id: Number(person_id) },
            data: body
        });
  
        return NextResponse.json(updatedPersonnel);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

//Delete a personnel
export async function DELETE(req) {
    try {
        const url = req.url;
        const person_id = url.split('/').pop();

        if (!person_id) {
        return NextResponse.json({ error: "Missing person_id parameter" }, { status: 400 });
        }

        await prisma.personnel.delete({
            where: { person_id: Number(person_id) }
        });

        return NextResponse.json({ message: "Personnel deleted successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}