import { GET } from "./reverseGeocodeHandler";

describe("Reverse Geocode Handler", () => {
	let originalFetch: typeof global.fetch;

	beforeAll(() => {
		originalFetch = global.fetch;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	beforeEach(() => {
		global.fetch = jest.fn();
	});

	const mockFetch = (status: number, data: any) => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: status >= 200 && status < 300,
			status,
			json: async () => data,
		});
	};

	it("returns 400 if lat or lng are missing", async () => {
		const req = new Request("http://localhost/api?lat=37.77");
		const res = await GET(req);

		expect(res.status).toBe(400);
		const data = await res.json();
		expect(data).toHaveProperty("error");
	});

	it("extracts city from Nominatim response", async () => {
		mockFetch(200, {
			address: {
				city: "San Francisco",
				state: "California",
			},
		});

		const req = new Request("http://localhost/api?lat=37.7749&lng=-122.4194");
		const res = await GET(req);

		expect(global.fetch).toHaveBeenCalledWith(
			expect.stringContaining("lat=37.7749&lon=-122.4194"),
			expect.any(Object),
		);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toEqual({ locationName: "San Francisco" });
	});

	it("falls back to town, then suburb, then neighborhood if city missing", async () => {
		mockFetch(200, {
			address: {
				suburb: "Mission District",
				state: "California",
			},
		});

		const req = new Request("http://localhost/api?lat=37.77&lng=-122.41");
		const res = await GET(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toEqual({ locationName: "Mission District" });
	});

	it("returns 500 if the external API fails", async () => {
		mockFetch(500, { error: "Internal Server Error" });

		const req = new Request("http://localhost/api?lat=37.77&lng=-122.41");
		const res = await GET(req);
		expect(res.status).toBe(500);
	});
});
