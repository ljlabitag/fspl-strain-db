import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all variables
export async function GET() {
  try {
    const variables = await prisma.variable.findMany();
    return NextResponse.json(variables);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching variables" }, { status: 500 });
  }
}

// Add a new variable
export async function POST(req) {
  try {
    const body = await req.json();
    const { variable_name, data_type } = body;

    const newVariable = await prisma.variable.create({
      data: { variable_name, data_type },
    });

    return NextResponse.json(newVariable, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding variable" }, { status: 500 });
  }
}