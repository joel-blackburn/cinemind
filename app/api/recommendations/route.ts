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

Recommend 4 movies.

For each movie provide:
- title only (do not include release year or any other info in the title)
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
  const start = Date.now();
  const response = await client.responses.create({
    model: "gpt-5",
    input: prompt,
    reasoning: {
      effort: "minimal",
    },
  });

  console.log(`OpenAI call took ${(Date.now() - start) / 1000} seconds`);

  const rawOutput = response.output_text;

  try {
    console.log("GPT RESPONSE:");
    console.log(rawOutput);
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
