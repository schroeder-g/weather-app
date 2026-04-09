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

	// Scrubber State
	scrubberIndex: number | null;
	setScrubberIndex: (index: number | null) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChartContext() {
	const context = useContext(ChartContext);
	if (!context) {
		throw new Error("useChartContext must be used within a ChartProvider");
	}
	return context;
}

interface ChartProviderProps extends Omit<ChartContextValue, 'scrubberIndex' | 'setScrubberIndex'> {
	children: React.ReactNode;
}

export const ChartProvider = React.memo(
	({ children, ...value }: ChartProviderProps) => {
        const [scrubberIndex, setScrubberIndex] = useState<number | null>(null);
        
        // Bundle the scrubber stat along with primitive config
        const contextValue = React.useMemo(() => ({
            ...value,
            scrubberIndex,
            setScrubberIndex
        }), [value, scrubberIndex, setScrubberIndex]);

		return (
			<ChartContext.Provider value={contextValue}>{children}</ChartContext.Provider>
		);
	},
);

ChartProvider.displayName = "ChartProvider";
