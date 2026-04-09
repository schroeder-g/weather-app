import React, { useMemo, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import Svg, { G } from "react-native-svg";
import * as d3 from "d3";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import { ChartProvider } from "./forecast-chart/ChartContext";
import { useChartScrubber } from "./forecast-chart/useChartScrubber";
import ChartDataCurves from "./forecast-chart/ChartDataCurves";
import ChartGrid from "./forecast-chart/ChartGrid";
import ChartHighlightRegion from "./forecast-chart/ChartHighlightRegion";
import ChartScrubberTooltip from "./forecast-chart/ChartScrubberTooltip";
import ChartXAxis from "./forecast-chart/ChartXAxis";

interface Props {
  data: WeatherSummary;
}

// Inner component that actually mounts the handlers
const ChartLayout = ({ children }: { children: React.ReactNode }) => {
  const panHandlers = useChartScrubber();
  
  return (
    <View {...panHandlers} testID="chart-touch-surface">
      {children}
    </View>
  );
};

export default function ForecastChart({ data }: Props) {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [width, setWidth] = useState(0);

  const isMobile = screenWidth < 768;
  const height = isMobile
    ? screenHeight * 0.5
    : Math.min(screenHeight * 0.5, 400);

  const margin = useMemo(() => ({ top: 40, right: 20, bottom: 30, left: 30 }), []);

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const allPoints = data?.allPoints || [];

  const displayPoints = useMemo(() => {
    return allPoints.filter((p) => {
      if (!p?.time) return false;
      const hr = parseInt(p.time.split(":")[0], 10);
      return hr >= 6 && hr <= 21;
    });
  }, [allPoints]);

  const windowStartHour = data?.windowStartHour;
  const windowEndHour = data?.windowEndHour;

  const { yMin, yMax, pointsCount, innerWidth, innerHeight } = useMemo(() => {
    const allTemps = displayPoints.map((p) => p.temp);
    const minT = d3.min(allTemps) || 0;
    const maxT = d3.max(allTemps) || 100;

    return {
      yMin: Math.min(minT - 5, 0),
      yMax: Math.max(maxT + 5, 100),
      pointsCount: displayPoints.length,
      innerWidth: Math.max(0, width - margin.left - margin.right),
      innerHeight: height - margin.top - margin.bottom,
    };
  }, [
    displayPoints,
    width,
    margin.left,
    margin.right,
    margin.top,
    margin.bottom,
    height,
  ]);

  const xScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, Math.max(1, pointsCount - 1)])
        .range([0, innerWidth]),
    [pointsCount, innerWidth],
  );

  const yScale = useMemo(
    () => d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]),
    [yMin, yMax, innerHeight],
  );

  const yTicks = useMemo(() => yScale.ticks(4), [yScale]);

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

  const { startX, endX, hasStartIndex, hasEndIndex } = useMemo(() => {
    let sx = 0;
    let ex = innerWidth;
    const sIndex = displayPoints.findIndex(
      (p) => parseInt(p.time.split(":")[0], 10) === windowStartHour,
    );
    const eIndex = displayPoints.findIndex(
      (p) => parseInt(p.time.split(":")[0], 10) === windowEndHour,
    );

    if (sIndex >= 0) sx = xScale(sIndex);
    if (eIndex >= 0) ex = xScale(eIndex);

    return {
      startX: sx,
      endX: ex,
      hasStartIndex: sIndex >= 0,
      hasEndIndex: eIndex >= 0,
    };
  }, [displayPoints, windowStartHour, windowEndHour, innerWidth, xScale]);

  if (allPoints.length === 0 || displayPoints.length === 0) {
    return (
      <View
        onLayout={onLayout}
        style={{ height }}
        className="flex items-center justify-center bg-card rounded-xl"
      >
        <Text>No data</Text>
      </View>
    );
  }

  const contextValue = {
    innerWidth,
    innerHeight,
    margin,
    startX,
    endX,
    hasStartIndex,
    hasEndIndex,
    displayPoints,
    windowStartHour: windowStartHour || 0,
    windowEndHour: windowEndHour || 0,
    xScale,
    yScale,
    yTicks,
    tempPath,
    precipPath
  };

  return (
    <View
      className="my-4"
      onLayout={onLayout}
      testID="forecast-chart-container"
    >
      <ChartProvider {...contextValue}>
        {width > 0 && innerWidth > 0 && (
          <ChartLayout>
            <Svg width={width} height={height} pointerEvents="none">
              <G x={margin.left} y={margin.top}>
                <ChartHighlightRegion />
                <ChartGrid />
                <ChartXAxis />
                <ChartDataCurves />
                <ChartScrubberTooltip />
              </G>
            </Svg>
          </ChartLayout>
        )}
      </ChartProvider>
    </View>
  );
}
