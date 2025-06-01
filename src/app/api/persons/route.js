import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all persons
export async function GET() {
    try {
        const persons = await prisma.person.findMany({
            include: {
                projectMembers: {
                    include: {
                        project: true
                    }
                }
            },
        });

        // Post processing: add projects directly under person,
        // based on available project member records
        const personsWithProjects = persons.map(person => ({
            ...person,
            projects: person.projectMembers.map(pm => pm.project)
        }))
        return NextResponse.json(personsWithProjects);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching persons data" }, { status: 500 });
    }
}

// Add a new person
export async function POST(req) {
    try {
        const body = await req.json();
        const { person_name, position_title, email, role } = body;

        const validRoles = ["RESEARCH_ASSISTANT", "LAB_HEAD"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
        }

        const newPerson = await prisma.person.create({
            data: { 
                person_name,
                position_title,
                email,
                role,
            },
        });

        return NextResponse.json(newPerson, { status: 201 });
    } catch (error) {
        console.error("POST /api/persons error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}

