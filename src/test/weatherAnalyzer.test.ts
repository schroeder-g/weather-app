import {
	analyzeWeatherWindow,
	generateMessage,
	getRecommendation,
	type HourlyData,
	type WindowMetrics,
} from "@/lib/weatherAnalyzer";

describe("weatherAnalyzer", () => {
	const createMockHours = (
		temp: number,
		precip: number,
		wind: number,
		extras?: Partial<HourlyData>,
	): HourlyData[] => {
		return Array.from({ length: 24 }).map((_, i) => ({
			datetime: `${i.toString().padStart(2, "0")}:00:00`,
			temp,
			precipprob: precip,
			windspeed: wind,
			uvindex: 0,
			cloudcover: 0,
			severerisk: 0,
			icon: "clear-day",
			conditions: "Clear",
			...extras,
		}));
	};

	describe("analyzeWeatherWindow", () => {
		it("aggregates extended stats for the specific time window", async () => {
			const hours = createMockHours(65, 10, 5, {
				uvindex: 2,
				cloudcover: 10,
				severerisk: 0,
			});
			hours[9].temp = 70;
			hours[9].uvindex = 8;
			hours[10].temp = 75;
			hours[10].precipprob = 20;
			hours[10].severerisk = 10;
			hours[10].icon = "partly-cloudy-day";
			hours[10].conditions = "Partially cloudy";

			const result = await analyzeWeatherWindow({ hours } as any, 8, 12);
			expect(result.minTemp).toBe(65);
			expect(result.maxTemp).toBe(75);
			expect(result.avgPrecipProb).toBeGreaterThanOrEqual(12);
			expect(result.maxUvIndex).toBe(8);
			expect(result.maxSevereRisk).toBe(10);
			expect(result.primaryIcon).toBe("partly-cloudy-day");
			expect(result.primaryConditions).toBe("Partially cloudy");
		});

		it("passes through isLongRange flag", async () => {
			const hours = createMockHours(65, 10, 5);
			const result = await analyzeWeatherWindow({ hours } as any, 8, 12, true);
			expect(result.isLongRange).toBe(true);
		});
	});

	describe("getRecommendation", () => {
		it("returns Ideal for perfect weather", () => {
			const metrics: WindowMetrics = {
				minTemp: 65,
				maxTemp: 75,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 2,
				maxSevereRisk: 0,
				avgCloudCover: 0,
			};
			expect(getRecommendation(metrics)).toBe("Ideal");
		});

		it("returns Pleasant for good weather but high UV", () => {
			const metrics: WindowMetrics = {
				minTemp: 70,
				maxTemp: 80,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 9,
				maxSevereRisk: 0,
				avgCloudCover: 0,
			};
			expect(getRecommendation(metrics)).toBe("Pleasant");
		});

		it("returns Mixed for high wind or moderate rain", () => {
			const metrics: WindowMetrics = {
				minTemp: 60,
				maxTemp: 65,
				avgPrecipProb: 30,
				maxWindSpeed: 10,
				maxUvIndex: 2,
				maxSevereRisk: 0,
				avgCloudCover: 50,
			};
			expect(getRecommendation(metrics)).toBe("Mixed");
		});

		it("returns Poor for heavy rain or cold", () => {
			const metrics: WindowMetrics = {
				minTemp: 45,
				maxTemp: 50,
				avgPrecipProb: 10,
				maxWindSpeed: 20,
				maxUvIndex: 1,
				maxSevereRisk: 0,
				avgCloudCover: 100,
			};
			expect(getRecommendation(metrics)).toBe("Poor");
		});

		it("returns Warning for severe risk", () => {
			const metrics: WindowMetrics = {
				minTemp: 60,
				maxTemp: 65,
				avgPrecipProb: 60,
				maxWindSpeed: 5,
				maxUvIndex: 2,
				maxSevereRisk: 25,
				avgCloudCover: 80,
			};
			expect(getRecommendation(metrics)).toBe("Warning (Postpone)");
		});

		it("long range: only returns Warning for severe risk > 55", () => {
			const metrics: WindowMetrics = {
				minTemp: 60,
				maxTemp: 65,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 2,
				maxSevereRisk: 40,
				avgCloudCover: 0,
			};
			// 40 would be warning on short range
			expect(getRecommendation(metrics)).toBe("Warning (Postpone)");
			// But not on long range
			expect(getRecommendation(metrics, true)).not.toBe("Warning (Postpone)");

			// 60 is above 55
			metrics.maxSevereRisk = 60;
			expect(getRecommendation(metrics, true)).toBe("Warning (Postpone)");
		});
	});

	describe("generateMessage", () => {
		it("returns warning for severe risk", async () => {
			const metrics: WindowMetrics = {
				minTemp: 65,
				maxTemp: 70,
				avgPrecipProb: 60,
				maxWindSpeed: 5,
				maxUvIndex: 2,
				maxSevereRisk: 20,
				avgCloudCover: 90,
			};
			expect(await generateMessage(metrics)).toContain("Severe weather risk");
		});

		it("mentions UV index if it is extreme", async () => {
			const metrics: WindowMetrics = {
				minTemp: 85,
				maxTemp: 92,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 11,
				maxSevereRisk: 0,
				avgCloudCover: 0,
			};
			expect(await generateMessage(metrics)).toContain("Extreme UV risk");
		});

		it("mentions absolutely gorgeous for optimal conditions", async () => {
			const metrics: WindowMetrics = {
				minTemp: 65,
				maxTemp: 75,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 5,
				maxSevereRisk: 0,
				avgCloudCover: 20,
			};
			expect(await generateMessage(metrics)).toBe(
				"Absolutely gorgeous conditions expected.",
			);
		});

		it("returns speculative phrasing for long range", async () => {
			const metrics: WindowMetrics = {
				minTemp: 65,
				maxTemp: 75,
				avgPrecipProb: 0,
				maxWindSpeed: 5,
				maxUvIndex: 5,
				maxSevereRisk: 0,
				avgCloudCover: 20,
			};
			expect(await generateMessage(metrics, true)).toBe(
				"Models are hinting at gorgeous conditions.",
			);
		});
	});
});
