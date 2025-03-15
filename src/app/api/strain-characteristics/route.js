import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all strain characteristics
export async function GET() {
  try {
    const strainCharacteristics = await prisma.strainCharacteristic.findMany({
      include: { strain: true, variable: true },
    });
    return NextResponse.json(strainCharacteristics);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching strain characteristics" }, { status: 500 });
  }
}

// Add a new strain characteristic
export async function POST(req) {
  try {
    const body = await req.json();
    const { strain_id, variable_id, value } = body;

    const newStrainCharacteristic = await prisma.strainCharacteristic.create({
      data: { strain_id, variable_id, value },
    });

    return NextResponse.json(newStrainCharacteristic, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding strain characteristic" }, { status: 500 });
  }
}

//Update a strain characteristic
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const updatedCharacteristic = await prisma.strainCharacteristic.update({
      where: { id: Number(params.id) },
      data: body
    });
    return NextResponse.json(updatedCharacteristic);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a strain characteristic
export async function DELETE(req, { params }) {
  try {
    await prisma.strainCharacteristic.delete({
      where: { id: Number(params.id) }
    });
    return NextResponse.json({ message: "Strain characteristic deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
