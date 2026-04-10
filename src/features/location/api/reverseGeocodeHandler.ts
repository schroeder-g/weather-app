export async function GET(request: Request) {
	const url = new URL(request.url);
	const lat = url.searchParams.get("lat");
	const lng = url.searchParams.get("lng");

	if (!lat || !lng) {
		return new Response(
			JSON.stringify({ error: "lat and lng are required" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	try {
		// Using OpenStreetMap Nominatim for free reverse geocoding
		// Requires a valid User-Agent per their terms of service
		const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
		const response = await fetch(targetUrl, {
			headers: {
				"User-Agent": "WeatherApp/1.0 (internal proxy)",
			},
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: "Failed to fetch reverse geocode data" }),
				{ status: 500, headers: { "Content-Type": "application/json" } },
			);
		}

		const data = await response.json();

		if (data && data.address) {
			const { city, town, neighborhood, suburb, village, county } =
				data.address;
			// Precedence logic for Nominatim places
			const locationName =
				city || town || suburb || neighborhood || village || county;

			if (locationName) {
				return new Response(JSON.stringify({ locationName }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}
		}

		return new Response(
			JSON.stringify({ error: "Could not determine location name" }),
			{ status: 404, headers: { "Content-Type": "application/json" } },
		);
	} catch (error) {
		console.error("Reverse Geocode API Exception:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
