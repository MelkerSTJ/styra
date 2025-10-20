import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    const prompt = `
Du är en svensk föreningssekreterare. Skapa ett tydligt och kort mötesprotokoll utifrån anteckningarna nedan.

Strukturera det som:

§1 Mötets öppnande  
§2 Val av ordförande och sekreterare  
§3 Diskussionspunkter  
§4 Beslut och åtgärder  
§5 Nästa möte  
§6 Mötets avslutning  

Var kortfattad, formell och använd neutralt språk. Skriv på svenska.


${notes}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const protocolText =
      response.choices[0].message?.content?.trim() ||
      "Kunde inte skapa protokoll just nu.";

    return NextResponse.json({ protocolText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Något gick fel vid skapandet av protokollet." },
      { status: 500 }
    );
  }
}
