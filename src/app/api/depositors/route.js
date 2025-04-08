import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all depositors
export async function GET() {
    try {
        const depositors = await prisma.depositor.findMany({
            include: {
                personnel: true
            }
        });

        return NextResponse.json(depositors);
    } catch (error) {
        console.error("Error fetching depositors:", error);
        return NextResponse.json({ error: "Error fetching depositors" }, { status: 500 });
    }
}

// Add a new depositor
export async function POST(req) {
    try {
        const body = await req.json();
        const { depositor_name, organization, is_employee, person_id } = body;

        if (!depositor_name) {
            return NextResponse.json({ error: "Depositor name is required" }, { status: 400 });
        }

        const newDepositor = await prisma.depositor.create({
            data: {
                depositor_name,
                organization,
                is_employee,
                person_id: person_id || null
            }
        });

        return NextResponse.json(newDepositor, { status: 201 });
    } catch (error) {
        console.error("Error creating depositor:", error);
        return NextResponse.json({ error: "Error creating depositor" }, { status: 500 });
    }
}
