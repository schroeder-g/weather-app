import { baseColors } from "@/themes/config";
import React, { memo, useMemo } from "react";
import { G, Path } from "react-native-svg";
import * as d3 from "d3";
import { useChartContext } from "./ChartContext";

const ChartDataCurves = memo(() => {
  const { displayPoints, xScale, yScale } = useChartContext();

  const { tempPath, precipPath } = useMemo(() => {
    const tempLineGen = d3
      .line<any>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.temp))
      .curve(d3.curveMonotoneX);

    const precipLineGen = d3
      .line<any>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d.precip))
      .curve(d3.curveMonotoneX);

    return {
      tempPath: tempLineGen(displayPoints) as string | null,
      precipPath: precipLineGen(displayPoints) as string | null,
    };
  }, [displayPoints, xScale, yScale]);

  return (
    <G>
      {tempPath && (
        <Path d={tempPath} fill="none" stroke={baseColors.orange} strokeWidth={3} />
      )}
      {precipPath && (
        <Path d={precipPath} fill="none" stroke={baseColors.blue} strokeWidth={3} />
      )}
    </G>
  );
});

ChartDataCurves.displayName = "ChartDataCurves";

export default ChartDataCurves;
