import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, date, notes, agenda } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Titel saknas för mötet" },
        { status: 400 }
      );
    }

    const prompt = `
Du är en sekreterare i en svensk förening. 
Skriv ett korrekt, formellt och tydligt mötesprotokoll baserat på informationen nedan.

Titel: ${title}
Datum: ${date ?? "Ej angivet"}
Dagordning:
${agenda ?? "Ingen dagordning angiven."}

Anteckningar:
${notes ?? "Inga särskilda anteckningar."}

Protokollet ska följa svensk mötespraxis med:
- §-numrering
- Tydliga rubriker (Närvarande, Ärenden, Beslut, Övriga frågor)
- Formellt avslut med “Mötet avslutas kl …”.
  `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du är expert på svenska föreningsprotokoll och sekreterarspråk." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content =
      completion.choices[0].message?.content?.trim() ??
      "Ingen text returnerades från AI.";

    return NextResponse.json({ protocol: content });
  } catch (error) {
    console.error("Fel i /api/protocol:", error);
    return NextResponse.json(
      { error: "Något gick fel vid protokollgenerering." },
      { status: 500 }
    );
  }
}
