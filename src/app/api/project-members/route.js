import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all project members
export async function GET() {
    try {
        const projectMembers = await prisma.projectMember.findMany();
        return NextResponse.json(projectMembers);
    } catch (error) {
        console.error("Error fetching project members:", error);
        return NextResponse.json({ error: "Error fetching project members" }, { status: 500 });
    }
}

// Add a project member
export async function POST(req) {
    try {
        const body = await req.json();
        const { project_id, person_id, member_role } = body;

        // Check if the combination of project_id and person_id already exists
        const existingProjectMember = await prisma.projectMember.findUnique({
            where: {
                project_id_person_id: {
                    project_id,
                    person_id
                }
            }
        });

        if (existingProjectMember) {
            return NextResponse.json({ error: "This person is already a member of the project" }, { status: 400 });
        }

        const newProjectMember = await prisma.projectMember.create({
            data: { project_id, person_id, member_role },
        });

        return NextResponse.json(newProjectMember, { status: 201 });
    } catch (error) {
        console.error("Error adding project member:", error);
        return NextResponse.json({ error: "Error adding project member" }, { status: 500 });
    }
}