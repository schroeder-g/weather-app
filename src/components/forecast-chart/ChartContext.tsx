import type * as d3 from "d3";
import React, { createContext, useContext, useState } from "react";
import type { ProcessedPoint } from "@/lib/weatherAnalyzer";

// --- Static Values Context ---
interface ChartContextValue {
	// Dimensions
	innerWidth: number;
	innerHeight: number;
	margin: { top: number; right: number; bottom: number; left: number };

	// Data
	displayPoints: ProcessedPoint[];
	windowStartHour: number | undefined;
	windowEndHour: number | undefined;

	// Scales
	xScale: d3.ScaleLinear<number, number>;
	yScale: d3.ScaleLinear<number, number>;
}

// --- Scrubber State Context ---
interface ChartScrubberContextValue {
	scrubberIndex: number | null;
	setScrubberIndex: (index: number | null) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);
const ChartScrubberContext = createContext<ChartScrubberContextValue | null>(
	null,
);

export function useChartContext() {
	const context = useContext(ChartContext);
	if (!context) {
		throw new Error("useChartContext must be used within a ChartProvider");
	}
	return context;
}

export function useChartScrubberContext() {
	const context = useContext(ChartScrubberContext);
	if (!context) {
		throw new Error(
			"useChartScrubberContext must be used within a ChartProvider",
		);
	}
	return context;
}

interface ChartProviderProps extends ChartContextValue {
	children: React.ReactNode;
}

export const ChartProvider = React.memo(
	({ children, ...valueProps }: ChartProviderProps) => {
		const [scrubberIndex, setScrubberIndex] = useState<number | null>(null);

		const scrubberValue = React.useMemo(
			() => ({
				scrubberIndex,
				setScrubberIndex,
			}),
			[scrubberIndex, setScrubberIndex],
		);

		// Memoizing the spread object is critical to prevent Context churn
		const staticValue = React.useMemo(
			() => valueProps,
			[
				valueProps.innerWidth,
				valueProps.innerHeight,
				valueProps.margin,
				valueProps.displayPoints,
				valueProps.windowStartHour,
				valueProps.windowEndHour,
				valueProps.xScale,
				valueProps.yScale,
			],
		);

		return (
			<ChartContext.Provider value={staticValue}>
				<ChartScrubberContext.Provider value={scrubberValue}>
					{children}
				</ChartScrubberContext.Provider>
			</ChartContext.Provider>
		);
	},
);

ChartProvider.displayName = "ChartProvider";
