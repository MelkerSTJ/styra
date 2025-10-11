import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { protocol } = await req.json();

    if (!protocol) {
      return NextResponse.json(
        { error: "Inget protokoll skickades för sammanfattning" },
        { status: 400 }
      );
    }

    const prompt = `
Du är sekreterare i en svensk förening.
Sammanfatta följande mötesprotokoll i en tydlig, kort punktlista på svenska.
Fokusera på:
- Viktiga beslut
- Ansvarsfördelning
- Diskussioner och resultat
- Eventuella datum för nästa möte

Sammanfattningen ska vara kort, saklig och följa svensk föreningston.

Protokoll:
${protocol}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du är expert på svenska mötesprotokoll och skriver sammanfattningar i punktform med fokus på beslut och ansvar.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const summary =
      completion.choices[0].message?.content?.trim() ??
      "Ingen sammanfattning genererades.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Fel i /api/summary:", error);
    return NextResponse.json(
      { error: "Kunde inte generera sammanfattning" },
      { status: 500 }
    );
  }
}
