import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, date, notes } = await req.json();

    const prompt = `
Du är sekreterare i en svensk förening.
Skriv en tydlig och kort dagordning för mötet "${title}" den ${date}.
Använd klassisk svensk föreningsstruktur (Öppnande, Godkännande av dagordning, Ekonomi, Beslut, Övriga frågor, Avslutande).
Anteckningar från skaparen: ${notes ?? "Inga särskilda anteckningar"}.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du är expert på svenska föreningsmöten." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0].message?.content ?? "Ingen respons från AI.";

    return NextResponse.json({ agenda: content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Något gick fel" }, { status: 500 });
  }
}
