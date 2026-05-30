import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();

  const { watchlist, preferences } = body;

  const prompt = `
You are an expert movie recommendation engine.

The user has saved these movies:
${watchlist.map((m: { title: string }) => `- ${m.title}`).join("\n")}

Preferences:
${JSON.stringify(preferences, null, 2)}

Recommend 5 movies.

For each movie provide:
- title
- reason
- score as a number out of 10

Return ONLY valid JSON. Do not include markdown. Do not wrap it in a code block.

Use this exact format:

{
  "recommendations": [
    {
      "title": "",
      "reason": "",
      "score": 0
    }
  ]
}
`;

  const response = await client.responses.create({
    model: "gpt-5",
    input: prompt,
  });

  const rawOutput = response.output_text;

  try {
    const parsedOutput = JSON.parse(rawOutput);

    return Response.json(parsedOutput);
  } catch {
    return Response.json(
      {
        error: "Failed to parse recommendation response",
        rawOutput,
      },
      { status: 500 },
    );
  }
}
