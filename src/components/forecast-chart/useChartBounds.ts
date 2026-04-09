import { useMemo } from "react";
import { useChartContext } from "./ChartContext";

export function useChartBounds() {
  const { displayPoints, windowStartHour, windowEndHour, innerWidth, xScale } = useChartContext();

  return useMemo(() => {
    let startX = 0;
    let endX = innerWidth;

    const sIndex = displayPoints.findIndex(
      (p) => parseInt(p.time.split(":")[0], 10) === windowStartHour,
    );
    const eIndex = displayPoints.findIndex(
      (p) => parseInt(p.time.split(":")[0], 10) === windowEndHour,
    );

    if (sIndex >= 0) startX = xScale(sIndex);
    if (eIndex >= 0) endX = xScale(eIndex);

    return {
      startX,
      endX,
      hasStartIndex: sIndex >= 0,
      hasEndIndex: eIndex >= 0,
    };
  }, [displayPoints, windowStartHour, windowEndHour, innerWidth, xScale]);
}
