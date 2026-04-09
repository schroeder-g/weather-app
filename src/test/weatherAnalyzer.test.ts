import {
	analyzeWeatherWindow,
	generateMessage,
	getRecommendation,
	HourlyData,
} from "@/lib/weatherAnalyzer";

describe("weatherAnalyzer", () => {
	const createMockHours = (temp: number, precip: number, wind: number) => {
		return Array.from({ length: 24 }).map((_, i) => ({
			datetime: `${i.toString().padStart(2, "0")}:00:00`,
			temp,
			precipprob: precip,
			windspeed: wind,
		}));
	};

	describe("analyzeWeatherWindow", () => {
		it("aggregates stats for the specific time window", () => {
			const hours = createMockHours(65, 10, 5);
			hours[9].temp = 70; // 9 AM
			hours[10].temp = 75; // 10 AM
			hours[10].precipprob = 20;

			const result = analyzeWeatherWindow({ hours } as any, 8, 12);
			expect(result.minTemp).toBe(65);
			expect(result.maxTemp).toBe(75);
			expect(result.avgPrecipProb).toBeGreaterThanOrEqual(12); // (10+10+20+10) / 4
			expect(result.points.length).toBe(5); // 8,9,10,11,12 inclusive
		});
	});

	describe("getRecommendation", () => {
		it("returns Good for ideal weather", () => {
			expect(getRecommendation(65, 70, 0, 5)).toBe("Good");
		});

		it("returns Postpone Candidate for high rain", () => {
			expect(getRecommendation(60, 65, 60, 5)).toBe("Postpone Candidate");
		});

		it("returns Mixed for high wind", () => {
			expect(getRecommendation(60, 65, 0, 20)).toBe("Mixed");
		});
	});

	describe("generateMessage", () => {
		it("returns absolutely gorgeous for 60-75 and low precip", () => {
			expect(generateMessage(65, 70, 0, 5)).toBe(
				"Absolutely gorgeous conditions expected.",
			);
		});

		it("returns chance of rain for high precip", () => {
			expect(generateMessage(65, 70, 60, 5)).toContain("Chance of rain");
		});
	});
});
