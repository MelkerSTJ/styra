import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { agenda } = await req.json()

    if (!agenda) {
      return NextResponse.json(
        { error: "Ingen dagordning angiven" },
        { status: 400 }
      )
    }

    const prompt = `
Du är en erfaren svensk föreningssekreterare.
Förbättra språket i dagordningen nedan så att den låter formell, tydlig och korrekt skriven.
Behåll strukturen, punkterna och numreringen (1., 2., 3., osv).
Korrigera småfel, lägg till naturliga övergångar och använd en enhetlig ton.

Skriv svaret som ren text utan förklaringar.

Dagordning:
${agenda}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du är en professionell svensk sekreterare som förbättrar formalia i mötesprotokoll och dagordningar.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 900, // ökat utrymme
    })

    const improved = completion.choices[0].message?.content?.trim() || agenda
    return NextResponse.json({ agenda: improved })
  } catch (error) {
    console.error("Fel i /api/agenda/improve:", error)
    return NextResponse.json(
      { error: "Kunde inte förbättra dagordning" },
      { status: 500 }
    )
  }
}
