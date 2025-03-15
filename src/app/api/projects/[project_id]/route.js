import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Update ALL project info
export async function PUT(req) {
    try {
        const url = req.url;
        const project_id = url.split("/").pop();

        if (!project_id) {
            return NextResponse.json({ error: "Missing project id" }, { status: 400 });
        }

        const body = await req.json();
        const updatedProject = await prisma.project.update({
            where: { project_id: Number(project_id) },
            data: body
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.log("Error updating project:", error);
        return NextResponse.json({ error: "Error updating project" }, { status: 500 });
    }
}

// Delete a project
export async function DELETE(req) {
    try {
        const url = req.url;
        const project_id = url.split("/").pop();

        if (!project_id) {
            return NextResponse.json({ error: "Missing project id" }, { status: 400 });
        }

        await prisma.project.delete({
            where: { project_id: Number(project_id) },
        });

        return NextResponse.json({ message: "Project deleted" });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json({ error: "Error deleting project" }, { status: 500 });
    }
}