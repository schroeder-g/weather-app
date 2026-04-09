import { palette } from "@/themes/config";
import React, { memo } from "react";
import { G, Line, Text as SvgText } from "react-native-svg";
import { useChartContext } from "./ChartContext";

const ChartXAxis = memo(() => {
  const { 
    displayPoints, 
    windowStartHour, 
    windowEndHour, 
    xScale, 
    innerHeight, 
    startX, 
    endX, 
    hasStartIndex, 
    hasEndIndex 
  } = useChartContext();

  return (
    <G>
      {/* Highlight window boundaries */}
      {hasStartIndex && (
        <Line
          x1={startX}
          x2={startX}
          y1={0}
          y2={innerHeight}
          stroke={palette.zinc[300]}
          strokeWidth={1.5}
          strokeDasharray="6,6"
        />
      )}
      {hasEndIndex && (
        <Line
          x1={endX}
          x2={endX}
          y1={0}
          y2={innerHeight}
          stroke={palette.zinc[300]}
          strokeWidth={1.5}
          strokeDasharray="6,6"
        />
      )}

      {/* Time labels */}
      {displayPoints.map((p, i) => {
        const hour = parseInt(p.time.split(":")[0], 10);
        const isSelected = hour >= windowStartHour && hour <= windowEndHour;

        // Only show even hours to prevent crowding
        if (hour % 2 !== 0) return null;

        return (
          <SvgText
            key={`time-${i}`}
            x={xScale(i)}
            y={innerHeight + 20}
            fontSize="10"
            fill={isSelected ? palette.zinc[700] : palette.zinc[400]}
            fontWeight={isSelected ? "bold" : "normal"}
            textAnchor="middle"
          >
            {hour > 12 ? `${hour - 12}p` : hour === 12 ? "12p" : `${hour}a`}
          </SvgText>
        );
      })}
    </G>
  );
});

ChartXAxis.displayName = "ChartXAxis";

export default ChartXAxis;
