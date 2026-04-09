import React, { memo } from "react";
import { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import { calculateScrubberData } from "@/lib/scrubberUtils";
import { baseColors, palette } from "@/themes/config";
import { useChartContext } from "./ChartContext";

const formatScrubTime = (timeStr: string) => {
	if (!timeStr) return "";
	const [h, m] = timeStr.split(":").map(Number);
	const suffix = h >= 12 ? "pm" : "am";
	let hour12 = h % 12;
	if (hour12 === 0) hour12 = 12;
	return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
};

const ChartScrubberTooltip = memo(() => {
	const { scrubberIndex, displayPoints, xScale, yScale, innerHeight } =
		useChartContext();

	if (scrubberIndex === null) return null;

	// Derivation happens here, strictly collocated.
	const scrubResult = calculateScrubberData(
		displayPoints as any,
		scrubberIndex,
	);
	if (!scrubResult) return null;

	const x = xScale(scrubResult.index);
	const tempY = yScale(scrubResult.temp);
	const precipY = yScale(scrubResult.precip);

	return (
		<G>
			<Line
				x1={x}
				x2={x}
				y1={0}
				y2={innerHeight}
				stroke={palette.zinc[300]}
				strokeWidth={1.5}
				strokeDasharray="6,6"
			/>
			<Circle
				cx={x}
				cy={tempY}
				r={5}
				fill={baseColors.orange}
				stroke="white"
				strokeWidth={2}
			/>
			<Circle
				cx={x}
				cy={precipY}
				r={5}
				fill={baseColors.blue}
				stroke="white"
				strokeWidth={2}
			/>

			<Rect
				x={x - 45}
				y={-20}
				width={90}
				height={40}
				rx={6}
				fill={palette.zinc[800]}
			/>
			<SvgText
				x={x}
				y={-5}
				fill="white"
				fontSize="12"
				textAnchor="middle"
				fontWeight="bold"
			>
				{formatScrubTime(scrubResult.time)}
			</SvgText>
			<SvgText
				x={x}
				y={14}
				fill={palette.zinc[300]}
				fontSize="10"
				textAnchor="middle"
			>
				{`${Math.round(scrubResult.temp)}°F | ${Math.round(scrubResult.precip)}%`}
			</SvgText>
		</G>
	);
});

ChartScrubberTooltip.displayName = "ChartScrubberTooltip";

export default ChartScrubberTooltip;
