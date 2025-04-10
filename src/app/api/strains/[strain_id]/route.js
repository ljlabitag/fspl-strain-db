import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

//Update info for a specific strain
export async function PUT(req) {
    try {
        const url = req.url;
        const strain_id = parseInt(url.split("/").pop(), 10);

        if (!strain_id) {
            return NextResponse.json({ error: "Missing strain ID" }, { status: 400 });
        }

        const {
            strain_genus,
            strain_species,
            status,
            storage_form,
            strain_source,
            loc_id,
            depositor_id,
            characteristics
        } = await req.json();

        // Update the main strain table
        const updatedStrain = await prisma.strain.update({
            where: { strain_id },
            data: {
                strain_genus,
                strain_species,
                status,
                storage_form,
                strain_source,
                loc_id,
                depositor_id
            }
        });

        // Clear old characteristics
        await prisma.strainCharacteristic.deleteMany({
            where: { strain_id }
        });

        // Add updated characteristics
        if (Array.isArray(characteristics)) {
            await prisma.$transaction(
                characteristics.map((char) =>
                    prisma.strainCharacteristic.create({
                        data: {
                            strain_id,
                            variable_id: char.id,
                            value: char.value
                        }
                    })
                )
            );
        }

        const finalUpdatedStrain = await prisma.strain.findUnique({
            where: { strain_id },
            include: {
                location: true,
                depositor: true,
                characteristics: {
                    include: { variable: true }
                }
            }
        });

        return NextResponse.json(finalUpdatedStrain, { status: 200 });
    } catch (error) {
        console.error("Error updating strain:", error);
        return NextResponse.json({ error: "Error updating strain" }, { status: 500 });
    }
}


// Delete a strain
export async function DELETE(req) {
    try {
        const url = req.url;
        const strain_id = url.split("/").pop();

        if (!strain_id) {
            return NextResponse.json({ error: "Missing strain ID" }, { status: 400 });
        }

        await prisma.strain.delete({
            where: { strain_id: Number(strain_id) },
        });

        return NextResponse.json({ message: "Strain deleted" });
    } 
    catch (error) {
        return NextResponse.json({ error: "Error deleting strain" }, { status: 500 });
    }
}
