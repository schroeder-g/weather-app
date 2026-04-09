export async function GET(request: Request) {
	const url = new URL(request.url);
	const location = url.searchParams.get("location");

	if (!location) {
		return new Response(JSON.stringify({ error: "Location is required" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	const apiKey = process.env.VISUAL_CROSSING_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({ error: "Server configuration error: missing API key" }),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}

	try {
		const targetUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
			location,
		)}/next15days?unitGroup=us&elements=%2Baqius&include=hours,days&key=${apiKey}&contentType=json`;

		const response = await fetch(targetUrl);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Visual Crossing Error:", errorText);
			return new Response(
				JSON.stringify({ error: "Failed to fetch weather data" }),
				{ status: response.status, headers: { "Content-Type": "application/json" } },
			);
		}

		const data = await response.json();
		return new Response(JSON.stringify(data), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Server API Exception:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
