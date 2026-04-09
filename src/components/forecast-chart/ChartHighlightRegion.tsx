import React, { memo } from "react";
import { Path } from "react-native-svg";
import { palette } from "@/themes/config";
import { useChartContext } from "./ChartContext";
import { useChartBounds } from "./useChartBounds";

const ChartHighlightRegion = memo(() => {
	const { innerHeight } = useChartContext();
	const { startX, endX, hasStartIndex, hasEndIndex } = useChartBounds();
	const hasValidSlot = hasStartIndex && hasEndIndex;

	if (!hasValidSlot) return null;

	return (
		<Path
			d={`M ${startX} 0 L ${endX} 0 L ${endX} ${innerHeight} L ${startX} ${innerHeight} Z`}
			fill={palette.zinc[100]}
		/>
	);
});

ChartHighlightRegion.displayName = "ChartHighlightRegion";

export default ChartHighlightRegion;
