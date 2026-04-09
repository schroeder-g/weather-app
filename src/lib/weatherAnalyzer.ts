export interface HourlyData {
	datetime: string;
	temp: number;
	precipprob: number;
	windspeed: number;
}

export interface DayData {
	datetime: string;
	hours: HourlyData[];
	icon: string;
}

export interface WeatherSummary {
	minTemp: number;
	maxTemp: number;
	avgPrecipProb: number;
	maxWindSpeed: number;
	recommendation: RecommendationSignal;
	message: string;
	points: { time: string; temp: number; precip: number; wind: number }[];
}

export type RecommendationSignal = "Good" | "Mixed" | "Postpone Candidate";

export function analyzeWeatherWindow(
	day: DayData,
	startHour: number,
	endHour: number,
): WeatherSummary {
	if (!day || !day.hours || day.hours.length === 0) {
		return {
			minTemp: 0,
			maxTemp: 0,
			avgPrecipProb: 0,
			maxWindSpeed: 0,
			recommendation: "Mixed",
			message: "No data available",
			points: [],
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
			recommendation: "Mixed",
			message: "No data for time slot",
			points: [],
		};
	}

	const temps = windowHours.map((h) => h.temp);
	const precips = windowHours.map((h) => h.precipprob);
	const winds = windowHours.map((h) => h.windspeed);

	const minTemp = Math.min(...temps);
	const maxTemp = Math.max(...temps);
	const avgPrecipProb = precips.reduce((sum, p) => sum + p, 0) / precips.length;
	const maxWindSpeed = Math.max(...winds);

	const points = windowHours.map((h) => ({
		time: h.datetime.substring(0, 5), // "08:00"
		temp: h.temp,
		precip: h.precipprob,
		wind: h.windspeed,
	}));

	const recommendation = getRecommendation(
		minTemp,
		maxTemp,
		avgPrecipProb,
		maxWindSpeed,
	);
	const message = generateMessage(
		minTemp,
		maxTemp,
		avgPrecipProb,
		maxWindSpeed,
	);

	return {
		minTemp,
		maxTemp,
		avgPrecipProb,
		maxWindSpeed,
		recommendation,
		message,
		points,
	};
}

export function getRecommendation(
	minTemp: number,
	maxTemp: number,
	precip: number,
	wind: number,
): RecommendationSignal {
	if (precip > 50 || maxTemp < 40 || minTemp > 100 || wind > 25) {
		return "Postpone Candidate";
	}
	if (precip > 20 || maxTemp < 50 || maxTemp > 90 || wind > 15) {
		return "Mixed";
	}
	return "Good";
}

export function generateMessage(
	minTemp: number,
	maxTemp: number,
	precip: number,
	wind: number,
): string {
	if (precip > 50) {
		return `Chance of rain (${Math.round(precip)}%). Might want to consider an indoor alternative.`;
	}

	if (minTemp >= 60 && maxTemp <= 75 && precip < 10) {
		return "Absolutely gorgeous conditions expected.";
	}

	if (maxTemp > 90) {
		return "It will be toasty. Bring plenty of water and seek shade!";
	}

	if (minTemp < 40) {
		return "Bundle up, it will be chilly!";
	}

	if (wind > 15) {
		return "Conditions are okay, but it will be quite windy.";
	}

	return "Expect standard conditions. Should be a pleasant meetup.";
}
