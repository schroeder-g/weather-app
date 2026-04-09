import { getBaseApiUrl } from "@/lib/apiUtils";

export interface HourlyData {
	datetime: string;
	temp: number;
	precipprob: number;
	windspeed: number;
	uvindex?: number;
	aqius?: number;
	cloudcover?: number;
	severerisk?: number;
	icon?: string;
	conditions?: string;
}

export interface DayData {
	datetime: string;
	hours: HourlyData[];
	icon: string;
}

export interface WindowMetrics {
	minTemp: number;
	maxTemp: number;
	avgPrecipProb: number;
	maxWindSpeed: number;
	maxUvIndex: number;
	maxSevereRisk: number;
	avgCloudCover: number;
}

export interface ProcessedPoint {
	time: string;
	temp: number;
	precip: number;
	wind: number;
	uv: number;
	aqi: number;
}

export interface WeatherSummary extends WindowMetrics {
	recommendation: RecommendationSignal;
	primaryIcon?: string;
	primaryConditions?: string;
	message: AsyncGenerator<string, void, unknown>;
	points: ProcessedPoint[];
	allPoints: ProcessedPoint[];
	windowStartHour: number;
	windowEndHour: number;
	isLongRange: boolean;
}
export type RecommendationSignal =
	| "Ideal"
	| "Pleasant"
	| "Mixed"
	| "Poor"
	| "Warning (Postpone)";

export async function analyzeWeatherWindow(
	day: DayData,
	startHour: number,
	endHour: number,
	isLongRange = false,
): Promise<WeatherSummary> {
	if (!day || !day.hours || day.hours.length === 0) {
		return {
			minTemp: 0,
			maxTemp: 0,
			avgPrecipProb: 0,
			maxWindSpeed: 0,
			maxUvIndex: 0,
			maxSevereRisk: 0,
			avgCloudCover: 0,
			recommendation: "Mixed",
			message: (async function* () {
				yield "No data available";
			})(),
			points: [],
			allPoints: [],
			windowStartHour: startHour,
			windowEndHour: endHour,
			isLongRange,
		};
	}

	const windowHours = day.hours.filter((h) => {
		const hour = parseInt(h.datetime.split(":")[0], 10);
		return hour >= startHour && hour <= endHour;
	});

	if (windowHours.length === 0) {
		return {
			minTemp: 0,
			maxTemp: 0,
			avgPrecipProb: 0,
			maxWindSpeed: 0,
			maxUvIndex: 0,
			maxSevereRisk: 0,
			avgCloudCover: 0,
			recommendation: "Mixed",
			message: (async function* () {
				yield "No data for time slot";
			})(),
			points: [],
			allPoints: [],
			windowStartHour: startHour,
			windowEndHour: endHour,
			isLongRange,
		};
	}

	const temps = windowHours.map((h) => h.temp);
	const precips = windowHours.map((h) => h.precipprob);
	const winds = windowHours.map((h) => h.windspeed);
	const uvIndices = windowHours.map((h) => h.uvindex || 0);
	const severeRisks = windowHours.map((h) => h.severerisk || 0);
	const cloudCovers = windowHours.map((h) => h.cloudcover || 0);

	const minTemp = Math.min(...temps);
	const maxTemp = Math.max(...temps);
	const avgPrecipProb = precips.reduce((sum, p) => sum + p, 0) / precips.length;
	const maxWindSpeed = Math.max(...winds);
	const maxUvIndex = Math.max(...uvIndices);
	const maxSevereRisk = Math.max(...severeRisks);
	const avgCloudCover =
		cloudCovers.reduce((sum, c) => sum + c, 0) / cloudCovers.length;

	// Pick a representative icon/condition from the middle of the window
	const midIndex = Math.floor(windowHours.length / 2);
	const primaryIcon = windowHours[midIndex]?.icon || "clear-day";
	const primaryConditions = windowHours[midIndex]?.conditions || "Clear";

	const points = windowHours.map((h) => ({
		time: h.datetime.substring(0, 5), // "08:00"
		temp: h.temp,
		precip: h.precipprob,
		wind: h.windspeed,
		uv: h.uvindex || 0,
		aqi: h.aqius || 0,
	}));

	const metrics: WindowMetrics = {
		minTemp,
		maxTemp,
		avgPrecipProb,
		maxWindSpeed,
		maxUvIndex,
		maxSevereRisk,
		avgCloudCover,
	};

	const recommendation = getRecommendation(metrics, isLongRange);
	const message = generateMessage(metrics, isLongRange);

	const allPoints = day.hours.map((h) => ({
		time: h.datetime.substring(0, 5),
		temp: h.temp,
		precip: h.precipprob,
		wind: h.windspeed,
		uv: h.uvindex || 0,
		aqi: h.aqius || 0,
	}));

	return {
		...metrics,
		recommendation,
		primaryIcon,
		primaryConditions,
		message,
		points,
		allPoints,
		windowStartHour: startHour,
		windowEndHour: endHour,
		isLongRange,
	};
}

export function getRecommendation(
	metrics: WindowMetrics,
	isLongRange = false,
): RecommendationSignal {
	const { precip, minTemp, maxTemp, wind, severe, uv } = {
		precip: metrics.avgPrecipProb,
		minTemp: metrics.minTemp,
		maxTemp: metrics.maxTemp,
		wind: metrics.maxWindSpeed,
		severe: metrics.maxSevereRisk,
		uv: metrics.maxUvIndex,
	};

	const severeThreshold = isLongRange ? 55 : 20;

	if (
		severe >= severeThreshold ||
		precip > 50 ||
		maxTemp < 30 ||
		minTemp > 105 ||
		wind > 30
	) {
		return "Warning (Postpone)";
	}
	if (precip > 30 || maxTemp <= 50 || maxTemp > 95 || wind >= 20) {
		return "Poor";
	}
	// Mixed meaning generally okay but noticeable drawback
	if (precip > 15 || wind > 15 || maxTemp > 90 || uv >= 10 || maxTemp < 60) {
		return "Mixed";
	}
	// Pleasant if it's decent but has minor issues like high UV or overcast
	if (uv >= 8 || minTemp < 60 || maxTemp > 85) {
		return "Pleasant";
	}

	// Ideal
	return "Ideal";
}

export async function* generateMessage(
	metrics: WindowMetrics,
	isLongRange = false,
): AsyncGenerator<string, void, unknown> {
	const { precip, minTemp, maxTemp, wind, severe, uv } = {
		precip: metrics.avgPrecipProb,
		minTemp: metrics.minTemp,
		maxTemp: metrics.maxTemp,
		wind: metrics.maxWindSpeed,
		severe: metrics.maxSevereRisk,
		uv: metrics.maxUvIndex,
	};

	const severeThreshold = isLongRange ? 55 : 20;

	// Check if we should attempt dynamic generation
	if (process.env.EXPO_PUBLIC_AX_ENABLED === "true") {
		try {
			const response = await fetch(getBaseApiUrl() + "/api/message", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					minTemp,
					maxTemp,
					precipProb: precip,
					maxWind: wind,
					maxUv: uv,
					severeRisk: severe,
					recommendation: getRecommendation(metrics, isLongRange),
					isLongRange,
				}),
			});

			if (!response.ok) {
				throw new Error(`API failed with status ${response.status}`);
			}

			const result = await response.json();

			if (result && result.message) {
				// Synthetic streaming: since React Native cannot natively parse raw TCP streams over its JS-XHR bridge automatically,
				// we execute the completion block on the server, and then yield the result iteratively so the UI
				// cleanly mounts the Typewriter effect via the AsyncGenerator pattern!
				const words = result.message.match(/(\S+\s*)/g) || [result.message];
				for (const word of words) {
					await new Promise((r) => setTimeout(r, 45)); // ~22 words a second
					yield word;
				}
			}
			return;
		} catch (e) {
			console.warn(
				"LLM message generation failed, falling back to deterministic output:",
				e,
			);
		}
	}

	if (severe >= severeThreshold) {
		yield isLongRange
			? "There's an early indication of severe weather risk. Seriously consider postponing."
			: `Severe weather risk is elevated (${severe}/100) due to potential for thunderstorms, hail, or high winds. Seriously consider postponing.`;
		return;
	}

	if (precip > 50) {
		yield isLongRange
			? `Models indicate a chance of rain (${Math.round(precip)}%). Might want to consider an indoor alternative.`
			: `Chance of rain (${Math.round(precip)}%). Might want to consider an indoor alternative.`;
		return;
	}

	if (uv >= 10 && maxTemp > 80) {
		yield isLongRange
			? "Early models show extreme UV risk. Bring sunscreen and stay hydrated!"
			: "Extreme UV risk. Bring sunscreen and stay hydrated!";
		return;
	}

	if (minTemp >= 60 && maxTemp <= 80 && precip < 10) {
		yield isLongRange
			? "Models are hinting at gorgeous conditions."
			: "Absolutely gorgeous conditions expected.";
		return;
	}

	if (maxTemp > 90) {
		yield isLongRange
			? "It looks like it will be toasty. Bring plenty of water and seek shade!"
			: "It will be toasty. Bring plenty of water and seek shade!";
		return;
	}

	if (minTemp < 40) {
		yield isLongRange
			? "It's looking chilly, bundle up!"
			: "Bundle up, it will be chilly!";
		return;
	}

	if (wind > 15) {
		yield isLongRange
			? "Conditions seem okay, but it might be quite windy."
			: "Conditions are okay, but it will be quite windy.";
		return;
	}

	yield isLongRange
		? "Preliminary forecast shows standard conditions."
		: "Expect standard conditions. Should be a pleasant meetup.";
}
