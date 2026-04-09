export interface WeatherPoint {
	time: string;
	temp: number;
	precip: number;
	wind: number;
	uv: number;
	aqi: number;
}

export interface ScrubberResult {
	time: string;
	temp: number;
	precip: number;
	wind: number;
	uv: number;
	aqi: number;
	index: number;
}

export function calculateScrubberData(
	points: WeatherPoint[],
	continuousIndex: number,
): ScrubberResult {
	if (points.length === 0) {
		return {
			time: "00:00",
			temp: 0,
			precip: 0,
			wind: 0,
			uv: 0,
			aqi: 0,
			index: 0,
		};
	}

	// 1. Clamp bounds
	const maxIndex = points.length - 1;
	const clamped = Math.max(0, Math.min(continuousIndex, maxIndex));

	// 2. Snap to 5-minute ticks (12 ticks per hour/index unit)
	const ticksPerUnit = 12;
	const snappedIndex = Math.round(clamped * ticksPerUnit) / ticksPerUnit;

	// 3. Interpolate
	const lowerBound = Math.floor(snappedIndex);
	const upperBound = Math.ceil(snappedIndex);

	const p1 = points[lowerBound];
	const p2 = points[upperBound];

	if (lowerBound === upperBound) {
		return {
			time: formatTimeWithOffset(p1.time, 0),
			temp: p1.temp,
			precip: p1.precip,
			wind: p1.wind,
			uv: p1.uv,
			aqi: p1.aqi,
			index: snappedIndex,
		};
	}

	const ratio = snappedIndex - lowerBound;
	const temp = p1.temp + (p2.temp - p1.temp) * ratio;
	const precip = p1.precip + (p2.precip - p1.precip) * ratio;
	const wind = p1.wind + (p2.wind - p1.wind) * ratio;
	const uv = p1.uv + (p2.uv - p1.uv) * ratio;
	const aqi = p1.aqi + (p2.aqi - p1.aqi) * ratio;

	// the 5-min offset
	const minuteOffset = Math.round(ratio * 60);

	return {
		time: formatTimeWithOffset(p1.time, minuteOffset),
		temp,
		precip,
		wind,
		uv,
		aqi,
		index: snappedIndex,
	};
}

function formatTimeWithOffset(baseTimeStr: string, addMinutes: number): string {
	// baseTimeStr is "06:00" format
	const [hours, minutes] = baseTimeStr.split(":").map(Number);
	let newMinutes = minutes + addMinutes;
	let newHours = hours;

	if (newMinutes >= 60) {
		newHours += Math.floor(newMinutes / 60);
		newMinutes = newMinutes % 60;
	}

	const hStr = newHours.toString().padStart(2, "0");
	const mStr = newMinutes.toString().padStart(2, "0");
	return `${hStr}:${mStr}`;
}
