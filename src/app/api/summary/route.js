import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Query counts from the strain DB
        const totalStrains = await prisma.strain.count();
        const activeCultures = await prisma.strain.count({
            where: { status: "active" }
        });
        const storageLocations = await prisma.location.count();
        const numberDepositors = await prisma.depositor.count();

         // Query all announcements, sorted by created_at (descending)
         const announcements = await prisma.announcement.findMany({
            orderBy: { created_at: "desc" },
            take: 5
        });
        
        // Query recent activity, sorted by created_at descending and limited to 10 entries
        const recentActivity = await prisma.recentActivity.findMany({
            orderBy: { created_at: "desc" },
            take: 10
        });

        return NextResponse.json({
            totalStrains,
            activeCultures,
            storageLocations,
            numberDepositors,
            announcements, 
            recentActivity
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching summary:", error);
        return NextResponse.json({ error: "Error fetching summary" }, { status: 500 });
    }
}
