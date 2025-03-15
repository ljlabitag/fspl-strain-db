import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all strains
export async function GET() {
  try {
    const strains = await prisma.strain.findMany({
      include: {
        location: true,
        depositor: true,
      },
    });
    return NextResponse.json(strains);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching strains" }, { status: 500 });
  }
}

// Add a new strain
export async function POST(req) {
  try {
    const body = await req.json();
    const { strain_genus, strain_species, status, form, strain_source, loc_id, depositor_id } = body;

    const newStrain = await prisma.strain.create({
      data: { strain_genus, strain_species, status, form, strain_source, loc_id, depositor_id },
    });

    return NextResponse.json(newStrain, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error adding strain" }, { status: 500 });
  }
}