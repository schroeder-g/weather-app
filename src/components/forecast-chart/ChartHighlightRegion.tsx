import { palette } from "@/themes/config";
import React, { memo } from "react";
import { Path } from "react-native-svg";
import { useChartContext } from "./ChartContext";

const ChartHighlightRegion = memo(() => {
  const { startX, endX, innerHeight, hasStartIndex, hasEndIndex } = useChartContext();
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
