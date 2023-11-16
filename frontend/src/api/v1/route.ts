import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const textParam = url.searchParams.get("text");
    const response = await fetch(
        `${process.env.NEST_URL}/places?text=${textParam}`,
        {
            next: {
                revalidate: 60,
            },
        }
    );

    return NextResponse.json(await response.json());
}
