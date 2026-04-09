import { baseColors } from "@/themes/config";
import React, { memo } from "react";
import { G, Path } from "react-native-svg";
import { useChartContext } from "./ChartContext";

const ChartDataCurves = memo(() => {
  const { tempPath, precipPath } = useChartContext();

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
