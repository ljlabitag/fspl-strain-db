import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all personnel
export async function GET() {
  try {
    const personnel = await prisma.personnel.findMany();
    return NextResponse.json(personnel);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching personnel data" }, { status: 500 });
  }
}

// Add a new personnel
export async function POST(req) {
  try {
    const body = await req.json();
    const { person_name, job_title, email_address } = body;

    const newPersonnel = await prisma.personnel.create({
      data: { person_name, job_title, email_address },
    });

    return NextResponse.json(newPersonnel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating personnel" }, { status: 500 });
  }
}

