import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany();
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching locations" }, { status: 500 });
  }
}

// Add a new location
export async function POST(req) {
  try {
    const body = await req.json();
    const { parent_loc_id, type, loc_name, root_loc_id } = body;

    const newLocation = await prisma.location.create({
      data: { parent_loc_id, type, loc_name, root_loc_id },
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding location" }, { status: 500 });
  }
}
