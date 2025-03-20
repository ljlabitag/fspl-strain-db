import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
                        { form: { contains: searchTerm, mode: "insensitive" } },
                        { location: { loc_name: { contains: searchTerm, mode: "insensitive" } } },
                        { depositor: { person_name: { contains: searchTerm, mode: "insensitive" } } },
                    ],
                };
            } else {
                const filterMapping = {
                    accession_number: {
                        strain_id: !isNaN(parseInt(searchTerm)) ? parseInt(searchTerm) : 0, // Ensure valid integer
                    },
                    depositor: {
                        depositor: { person_name: { contains: searchTerm, mode: "insensitive" } },
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
                depositor: true, // Include depositor details
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
        const { strain_genus, strain_species, status, form, strain_source, loc_id, location, depositor_id, depositor } = body;

        let resolvedLocId = loc_id;
        let resolvedDepositorId = depositor_id;

        // Resolve location ID if only location name is provided
        if (!resolvedLocId && location) {
            const existingLocation = await prisma.location.findUnique({
                where: { loc_name: location },
            });

            if (existingLocation) {
                resolvedLocId = existingLocation.location_id;
            } else {
                // Optionally create a new location if it doesn't exist
                const newLocation = await prisma.location.create({
                    data: { loc_name: location, type: "Unknown" }, // Adjust "type" or other fields as needed
                });
                resolvedLocId = newLocation.location_id;
            }
        }

        // Resolve depositor ID if only depositor name is provided
        if (!resolvedDepositorId && depositor) {
            const existingDepositor = await prisma.personnel.findUnique({
                where: { person_name: depositor },
            });

            if (existingDepositor) {
                resolvedDepositorId = existingDepositor.person_id;
            } else {
                // Optionally create a new depositor if they don't exist
                const newDepositor = await prisma.personnel.create({
                    data: { person_name: depositor, email_address: `${depositor.toLowerCase().replace(/\s+/g, ".")}@example.com` }, // Adjust email logic as needed
                });
                resolvedDepositorId = newDepositor.person_id;
            }
        }

        // Create the new strain
        const newStrain = await prisma.strain.create({
            data: {
                strain_genus,
                strain_species,
                status,
                form,
                strain_source,
                loc_id: resolvedLocId,
                depositor_id: resolvedDepositorId,
            },
        });

        return NextResponse.json(newStrain, { status: 201 });
    } catch (error) {
        console.error("Error adding strain:", error);
        return NextResponse.json({ error: "Error adding strain" }, { status: 500 });
    }
}