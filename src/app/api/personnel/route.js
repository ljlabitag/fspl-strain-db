import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all personnel
export async function GET() {
    try {
        const personnel = await prisma.personnel.findMany({
            include: {
                projects: {
                    include: {
                        project: true
                    },
                },
            }
        });
        return NextResponse.json(personnel);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching personnel data" }, { status: 500 });
    }
}

// Add a new personnel
export async function POST(req) {
    try {
        const body = await req.json();
        const { person_name, job_title, email_address, role } = body;

        const validRoles = ["RESEARCH_ASSISTANT", "LAB_HEAD"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
        }

        const newPersonnel = await prisma.personnel.create({
            data: { 
                person_name,
                job_title,
                email_address,
                role,
            },
        });

        return NextResponse.json(newPersonnel, { status: 201 });
    } catch (error) {
        console.error("POST /api/personnel error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}

