import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/meetings – skapa nytt möte
export async function POST(req: Request) {
  try {
    const { title, date, agenda, notes, protocol } = await req.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: "Titel och datum krävs" },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        date: new Date(date),
        agenda,
        notes,
        protocol,
      },
    });

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Fel vid skapande av möte:", error);
    return NextResponse.json(
      { error: "Något gick fel vid skapande av möte" },
      { status: 500 }
    );
  }
}

// GET /api/meetings – hämta alla möten
export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Fel vid hämtning av möten:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta möten" },
      { status: 500 }
    );
  }
}
