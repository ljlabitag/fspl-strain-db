import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update ALL info of a person
export async function PUT(req) {
    try {
        const url = req.url;
        const person_id = url.split('/').pop();

        if (!person_id) {
            return NextResponse.json({ error: "Missing person_id parameter" }, { status: 400 });
        }

        const body = await req.json();
        const { person_name, job_title, email_address, role } = body;

        const validRoles = ["RESEARCH_ASSISTANT", "LAB_HEAD"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
        }

        const updatedPerson = await prisma.person.update({
            where: { person_id: Number(person_id) },
            data: {
                person_name,
                job_title,
                email_address,
                role
            }
        });

        return NextResponse.json(updatedPerson);
    } catch (error) {
        console.log("PUT /api/persons/:id error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


//Delete a person
export async function DELETE(req) {
    try {
        const url = req.url;
        const person_id = url.split('/').pop();

        if (!person_id) {
        return NextResponse.json({ error: "Missing person_id parameter" }, { status: 400 });
        }

        await prisma.person.delete({
            where: { person_id: Number(person_id) }
        });

        return NextResponse.json({ message: "Person deleted successfully" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}