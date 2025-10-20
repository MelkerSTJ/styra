import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
Du är en svensk mötesassistent. Förbättra anteckningarna språkligt men ändra inte betydelsen.
- Gör texten tydligare och mer formell.
- Behåll punktlistor.
- Gör inga tillägg eller påhitt.


${text}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const improvedText = response.choices[0].message?.content?.trim() || text;
    return NextResponse.json({ improvedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Något gick fel med AI-förbättringen." },
      { status: 500 }
    );
  }
}
