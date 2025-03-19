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
          accession_number: { strain_id: parseInt(searchTerm) || 0 },
          depositor: { depositor: { person_name: { contains: searchTerm, mode: "insensitive" } } },
          genus: { strain_genus: { contains: searchTerm, mode: "insensitive" } },
          species: { strain_species: { contains: searchTerm, mode: "insensitive" } },
          location: { location: { loc_name: { contains: searchTerm, mode: "insensitive" } } },
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