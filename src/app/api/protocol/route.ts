import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, date, notes, agenda } = await req.json();

    const prompt = `
Du är sekreterare i en svensk förening.
Skriv ett tydligt, välformaterat mötesprotokoll baserat på mötet "${title}" som hölls ${date}.
Här är dagordningen:
${agenda ?? "Ingen dagordning angiven."}

Anteckningar från mötet:
${notes ?? "Inga särskilda anteckningar."}

Använd formell svensk protokollstil med §-numrering och avsluta med "Mötet avslutas".
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du är expert på svenska föreningsprotokoll." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message?.content ?? "Ingen respons från AI.";

    return NextResponse.json({ protocol: content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Något gick fel vid protokollgenerering" }, { status: 500 });
  }
}
