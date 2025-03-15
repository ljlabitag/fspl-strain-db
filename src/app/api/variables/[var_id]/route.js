import { NextResponse } from "next/server"; 
import prisma from "@/lib/prisma";

//Update a variable
export async function PUT(req) {
  try {
    const url = req.url;
    const var_id = url.split("/").pop();

    if (!var_id) {
      return NextResponse.json({ error: "Variable ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updatedVariable = await prisma.variable.update({
        where: { id: Number(var_id) },
        data: body
    });

    return NextResponse.json(updatedVariable, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating variable" }, { status: 500 });
  }
}

//Delete a variable
export async function DELETE(req) {
    try {
        const url = req.url;
        const var_id = url.split("/").pop();
    
        if (!var_id) {
        return NextResponse.json({ error: "Variable ID is required" }, { status: 400 });
        }
    
        await prisma.variable.delete({
        where: { id: Number(var_id) }
        });
    
        return NextResponse.json({ message: "Variable deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting variable" }, { status: 500 });
    }
}