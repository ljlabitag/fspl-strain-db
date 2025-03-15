import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 });
  }
}

// Add a new project
export async function POST(req) {
  try {
    const body = await req.json();
    const { project_title, funding_agency, fund_code } = body;

    const newProject = await prisma.project.create({
      data: { project_title, funding_agency, fund_code },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating project" }, { status: 500 });
  }
}