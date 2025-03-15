import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Update a project member
export async function PUT(req) {
    try {
        const url = req.url;
        const project_member_id = url.split("/").pop();

        if (!project_member_id) {
            return NextResponse.json({ error: "Missing project member id" }, { status: 400 });
        }

        const body = await req.json();
        const updatedProjectMember = await prisma.projectMember.update({
            where: { project_member_id: Number(project_member_id) },
            data: body,
        });

        return NextResponse.json(updatedProjectMember);
    } catch (error) {
        console.log("Error updating project member:", error);
        return NextResponse.json({ error: "Error updating project member" }, { status: 500 });
    }
}

// Delete a project member
export async function DELETE(req) {
    try {
        const url = req.url;
        const project_member_id = url.split("/").pop();

        if (!project_member_id) {
            return NextResponse.json({ error: "Missing project member id" }, { status: 400 });
        }

        await prisma.projectMember.delete({
            where: { project_member_id: Number(project_member_id) },
        });

        return NextResponse.json({ message: "Project member deleted" });
    } catch (error) {
        console.error("Error deleting project member:", error);
        return NextResponse.json({ error: "Error deleting project member" }, { status: 500 });
    }
}