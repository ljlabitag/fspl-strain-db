import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all strains with optional filtering
// This function handles GET requests to fetch strains based on search parameters
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const searchTerm = searchParams.get("searchTerm") || "";
        const filter = searchParams.get("filter") || "all";

        // Define search conditions
        let whereClause = {};

        if (searchTerm) {
            if (filter === "all") {
                whereClause = {
                    OR: [
                        { strain_genus: { contains: searchTerm, mode: "insensitive" } },
                        { strain_species: { contains: searchTerm, mode: "insensitive" } },
                        { status: { contains: searchTerm, mode: "insensitive" } },
                        { storage_form: { contains: searchTerm, mode: "insensitive" } },
                        { location: { loc_name: { contains: searchTerm, mode: "insensitive" } } },
                        { depositor: { depositor_name: { contains: searchTerm, mode: "insensitive" } } },
                    ],
                };
            } else {
                const filterMapping = {
                    accession_number: {
                        strain_id: !isNaN(parseInt(searchTerm)) ? parseInt(searchTerm) : 0, // Ensure valid integer
                    },
                    depositor: {
                        depositor: { depositor_name: { contains: searchTerm, mode: "insensitive" } },
                    },
                    genus: { strain_genus: { contains: searchTerm, mode: "insensitive" } },
                    species: { strain_species: { contains: searchTerm, mode: "insensitive" } },
                    location: {
                        location: { loc_name: { contains: searchTerm, mode: "insensitive" } },
                    },
                };
                whereClause = filterMapping[filter] || {};
            }
        }

        // Fetch filtered strains
        const strains = await prisma.strain.findMany({
            where: whereClause,
            include: {
                location: true, // Include location details
                depositor: {
                    include: {
                        personnel: true, // Include personnel details if the depositor is an employee
                    },
                },
            },
            take: 10, // Limit to first 10 results
        });

        return NextResponse.json(strains);
    } catch (error) {
        console.error("Error fetching strains:", error);
        return NextResponse.json({ error: "Error fetching strains" }, { status: 500 });
    }
}

// Add a new strain
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            strain_genus,
            strain_species,
            status,
            storage_form,
            strain_source,
            location,
            depositor_name,
            organization,
            is_employee
        } = body;

        // Resolve or create location
        let resolvedLocId = null;
        if (location) {
            const existingLoc = await prisma.location.findFirst({
                where: { loc_name: location }
            });

            if (existingLoc) {
                resolvedLocId = existingLoc.location_id;
            } else {
                const newLoc = await prisma.location.create({
                    data: {
                        loc_name: location,
                        type: "Box" // or infer based on context
                    }
                });
                resolvedLocId = newLoc.location_id;
            }
        }

        // Resolve or create depositor
        let resolvedDepositorId = null;
        if (depositor_name) {
            const existingDepositor = await prisma.depositor.findFirst({
                where: { depositor_name: depositor_name }
            });

            if (existingDepositor) {
                resolvedDepositorId = existingDepositor.depositor_id;
            } else {
                const newDepositor = await prisma.depositor.create({
                    data: {
                        depositor_name,
                        organization,
                        is_employee
                    }
                });
                resolvedDepositorId = newDepositor.depositor_id;
            }
        }

        // Create the strain
        const newStrain = await prisma.strain.create({
            data: {
                strain_genus,
                strain_species,
                status,
                storage_form,
                strain_source,
                loc_id: resolvedLocId,
                depositor_id: resolvedDepositorId
            },
            include: {
                location: true,
                depositor: true
            }
        });

        // If characteristics are provided, insert them
        if (body.characteristics?.length) {
            await prisma.$transaction(
                body.characteristics.map((char) =>
                    prisma.strainCharacteristic.create({
                        data: {
                            strain_id: newStrain.strain_id,
                            variable_id: char.id,
                            value: char.value
                        }
                    })
                )
            );
        }

        //Return the newly created strain including its characteristics
        const enrichedStrain = await prisma.strain.findUnique({
            where: { strain_id: newStrain.strain_id },
            include: {
                location: true,
                depositor: {
                    include: { personnel: true }
                },
                characteristics: {
                    include: { variable: true }
                }
            }
        });
        return NextResponse.json(enrichedStrain, { status: 201 });
        

    } catch (error) {
        console.error("Error creating strain:", error);
        return NextResponse.json(
            { error: "Failed to create strain" },
            { status: 500 }
        );
    }
}