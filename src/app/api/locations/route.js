import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all locations with hierarchical relationships
export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            include: {
                location_location_parent_loc_idTolocation: true, // Include parent location details
                location_location_root_loc_idTolocation: true,     // Include root location details
            },
        });

        return NextResponse.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error);
        return NextResponse.json({ error: "Error fetching locations" }, { status: 500 });
    }
}

// Add a new location
export async function POST(req) {
    try {
        const body = await req.json();
        const { parent_loc_id, type, loc_name, root_loc_id } = body;

        // Validate required fields
        if (!loc_name || !type) {
            return NextResponse.json({ error: "Location name and type are required" }, { status: 400 });
        }

        let resolvedParentLocId = parent_loc_id;
        let resolvedRootLocId = root_loc_id;

        // Resolve parent location ID if only the parent location name is provided
        if (!resolvedParentLocId && body.parent_loc_name) {
            const parentLocation = await prisma.location.findUnique({
                where: { loc_name: body.parent_loc_name },
            });

            if (parentLocation) {
                resolvedParentLocId = parentLocation.location_id;
            } else {
                return NextResponse.json({ error: "Parent location not found" }, { status: 404 });
            }
        }

        // Resolve root location ID if only the root location name is provided
        if (!resolvedRootLocId && body.root_loc_name) {
            const rootLocation = await prisma.location.findUnique({
                where: { loc_name: body.root_loc_name },
            });

            if (rootLocation) {
                resolvedRootLocId = rootLocation.location_id;
            } else {
                return NextResponse.json({ error: "Root location not found" }, { status: 404 });
            }
        }

        // Create the new location
        const newLocation = await prisma.location.create({
            data: {
                parent_loc_id: resolvedParentLocId,
                root_loc_id: resolvedRootLocId,
                type,
                loc_name,
            },
        });

        return NextResponse.json(newLocation, { status: 201 });
    } catch (error) {
        console.error("Error adding location:", error);
        return NextResponse.json({ error: "Error adding location" }, { status: 500 });
    }
}