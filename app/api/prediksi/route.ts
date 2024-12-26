import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const key = url.searchParams.get('q');

        if (!key) {
            return NextResponse.json({ error: 'Query parameter "q" is required.' }, { status: 400 });
        }

        console.log("Received key:", key);

        const prediksi = await prisma.prediksi.findMany({
            where: {
                general_id: key,
            },
            include: {
                diagnosis: true,
            },
        });

        if (prediksi.length === 0) {
            return NextResponse.json({ message: 'No predictions found for the given key.' }, { status: 404 });
        }

        return NextResponse.json(prediksi);

    } catch (error) {
        console.error("Error occurred while fetching predictions:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
