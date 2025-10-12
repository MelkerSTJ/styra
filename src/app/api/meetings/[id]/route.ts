import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/meetings/[id] – hämta specifikt möte
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: params.id },
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    const updated = await prisma.meeting.update({
      where: { id: params.id },
      data: {
        title: data.title,
        date: new Date(data.date),
        agenda: data.agenda,
        notes: data.notes,
        protocol: data.protocol,
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
