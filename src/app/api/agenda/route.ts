import { NextResponse, NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Titel saknas" }, { status: 400 })
    }

    const prompt = `
Du är en erfaren svensk föreningssekreterare. 
Skapa en komplett dagordning baserad på mötets titel: "${title}".

🎯 Regler:
- Dagordningen ska vara mellan 7 och 12 punkter lång.
- Alltid börja med "1. Mötets öppnande" och sluta med "Mötets avslutande".
- Anpassa punkterna efter mötets titel och typ (ekonomi, underhåll, planering, etc).
- Skriv på tydlig, korrekt svenska med enhetlig stil.
- Inga förklaringar, bara ren numrerad text.

Exempelstruktur:
1. Mötets öppnande  
2. Val av mötesordförande och sekreterare  
3. Godkännande av dagordning  
4. Föregående protokoll  
5. Ekonomisk rapport / Projektrapport  
6. Aktuella ärenden  
7. Framtidsplanering / Förslag  
8. Övriga frågor  
9. Nästa möte  
10. Mötets avslutande
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Du är en hjälpsam svensk sekreterare som skriver dagordningar för möten i bostadsrätts-, idrotts- och samfällighetsföreningar.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 800,
    })

    const agenda = completion.choices[0].message?.content?.trim() || ""
    return NextResponse.json({ agenda })
  } catch (error) {
    console.error("Fel i /api/agenda:", error)
    return NextResponse.json(
      { error: "Kunde inte generera dagordning" },
      { status: 500 }
    )
  }
}
