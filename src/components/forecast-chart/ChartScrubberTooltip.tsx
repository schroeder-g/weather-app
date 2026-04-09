import React, { memo } from "react";
import { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import { useWeatherComparisonContext } from "@/features/weather/WeatherComparisonProvider";
import { calculateScrubberData } from "./scrubberUtils";
import { baseColors, palette } from "@/themes/config";
import { useChartContext, useChartScrubberContext } from "./ChartContext";
import { CURVE_DEFINITIONS } from "./config";

const formatScrubTime = (timeStr: string) => {
	if (!timeStr) return "";
	const [h, m] = timeStr.split(":").map(Number);
	const suffix = h >= 12 ? "pm" : "am";
	let hour12 = h % 12;
	if (hour12 === 0) hour12 = 12;
	return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const ChartScrubberTooltip = memo(() => {
	const { scrubberIndex } = useChartScrubberContext();
	const { displayPoints, xScale, yScale, innerWidth, innerHeight } =
		useChartContext();
	const { state } = useWeatherComparisonContext();
	const activeCurves = state.activeCurves || [];

	if (scrubberIndex === null) return null;

	// Derivation happens here, strictly collocated.
	const scrubResult = calculateScrubberData(
		displayPoints as any,
		scrubberIndex,
	);
	if (!scrubResult) return null;

	const x = xScale(scrubResult.index);

	const getValStr = (curve: string, val: number) => {
		if (curve === "temp") return `${Math.round(val)}°F`;
		if (curve === "precip") return `${Math.round(val)}%`;
		if (curve === "wind") return `${Math.round(val)}mph`;
		if (curve === "uv") return `UV ${Math.round(val)}`;
		if (curve === "aqi") return `AQI ${Math.round(val)}`;
		return `${Math.round(val)}`;
	};

	const tooltipText = activeCurves
		.map((c) => getValStr(c, (scrubResult as any)[c]))
		.join(" | ");

	const estimatedWidth = Math.max(90, tooltipText.length * 6.5 + 32);
	const rectX = x - estimatedWidth / 2;
	const clampedRectX = Math.max(
		0,
		Math.min(rectX, innerWidth - estimatedWidth),
	);
	const textX = clampedRectX + estimatedWidth / 2;

	return (
		<G testID="chart-scrubber-tooltip">
			<Line
				x1={x}
				x2={x}
				y1={0}
				y2={innerHeight}
				stroke={palette.zinc[300]}
				strokeWidth={1.5}
				strokeDasharray="6,6"
			/>

			{activeCurves.map((curveType) => {
				const config =
					CURVE_DEFINITIONS[curveType as keyof typeof CURVE_DEFINITIONS];
				const val = (scrubResult as any)[curveType];
				if (val === undefined) return null;
				const cy = yScale(val);

				return (
					<Circle
						key={curveType}
						cx={x}
						cy={cy}
						r={5}
						fill={config.color}
						stroke="white"
						strokeWidth={2}
					/>
				);
			})}

			<Rect
				x={clampedRectX}
				y={-20}
				width={estimatedWidth}
				height={40}
				rx={6}
				fill={palette.zinc[800]}
			/>
			<SvgText
				x={textX}
				y={-5}
				fill="white"
				fontSize="12"
				textAnchor="middle"
				fontWeight="bold"
			>
				{formatScrubTime(scrubResult.time)}
			</SvgText>
			<SvgText
				x={textX}
				y={14}
				fill={palette.zinc[300]}
				fontSize="10"
				textAnchor="middle"
			>
				{tooltipText}
			</SvgText>
		</G>
	);
});

ChartScrubberTooltip.displayName = "ChartScrubberTooltip";

export default ChartScrubberTooltip;
