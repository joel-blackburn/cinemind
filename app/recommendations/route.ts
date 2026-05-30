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
- Title
- Why it was chosen
- CineMind Score out of 10

Return valid JSON in this format:

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

  return Response.json({
    output: response.output_text,
  });
}
