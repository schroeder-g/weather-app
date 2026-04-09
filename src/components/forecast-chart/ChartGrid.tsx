import { palette } from "@/themes/config";
import React, { memo, useMemo } from "react";
import { G, Line, Text as SvgText } from "react-native-svg";
import { useChartContext } from "./ChartContext";

const ChartGrid = memo(() => {
  const { innerWidth, yScale } = useChartContext();
  const yTicks = useMemo(() => yScale.ticks(4), [yScale]);

  return (
    <G>
      {yTicks.map((tick) => (
        <G key={`y-${tick}`}>
          <Line
            x1={0}
            x2={innerWidth}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={palette.zinc[200]}
            strokeWidth={1}
            strokeDasharray="2,4"
          />
          <SvgText
            x={-5}
            y={yScale(tick) + 4}
            fontSize="10"
            fill={palette.zinc[400]}
            textAnchor="end"
          >
            {tick}
          </SvgText>
        </G>
      ))}
    </G>
  );
});

ChartGrid.displayName = "ChartGrid";

export default ChartGrid;
