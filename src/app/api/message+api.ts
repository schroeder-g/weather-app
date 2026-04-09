import { ai, ax } from "@ax-llm/ax";

const messageSignature = ax(`
	minTemp:number, maxTemp:number, precipProb:number, maxWind:number, maxUv:number, severeRisk:number, recommendation:string, isLongRange:boolean 
	-> 
	message:string "A fun, brief, personable 1-sentence message for event organizers about event viability. Focus on the vibe and if it's a go. Do NOT list specific weather stats."
`);

export async function POST(request: Request) {
	try {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return new Response(
				JSON.stringify({ error: "Server configuration error: missing API key" }),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}

		const body = await request.json();

		const llm = ai({ name: "openai", apiKey });
		const result = await messageSignature.forward(llm, body, { stream: false } as any);

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("OpenAI API Exception:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
