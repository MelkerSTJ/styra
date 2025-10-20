import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/meetings/[id] – hämta specifikt möte
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!meeting) {
      return NextResponse.json({ error: "Möte hittades inte" }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Fel vid hämtning av möte:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta mötet" },
      { status: 500 }
    );
  }
}

// PUT /api/meetings/[id] – uppdatera möte
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await request.json();

    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        title: data.title,
        date: new Date(data.date),
        agenda: data.agenda,
        notes: data.notes,
        protocol: data.protocol,
        status: data.status ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Fel vid PUT /api/meetings/[id]:", error);
    return NextResponse.json(
      { error: "Kunde inte uppdatera mötet" },
      { status: 500 }
    );
  }
}
