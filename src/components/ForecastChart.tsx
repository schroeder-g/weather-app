import {
  calculateScrubberData,
  type ScrubberResult,
} from "@/lib/scrubberUtils";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import { baseColors, palette } from "@/themes/config";
import * as d3 from "d3";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { PanResponder, Text, useWindowDimensions, View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";

interface Props {
  data: WeatherSummary;
}

export default function ForecastChart({ data }: Props) {
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [width, setWidth] = useState(0);
  const [scrubberIndex, setScrubberIndex] = useState<number | null>(null);
  const lastHapticIndex = useRef<number | null>(null);
  const initialTouchX = useRef<number>(0);

  // Use 50% of screen height for mobile screens (width < 768px), else a max sensible height
  const isMobile = screenWidth < 768;
  const height = isMobile
    ? screenHeight * 0.5
    : Math.min(screenHeight * 0.5, 400);

  const margin = { top: 40, right: 20, bottom: 30, left: 30 };

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (!data || !data.allPoints || data.allPoints.length === 0) {
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

  // Filter down to a reasonable daytime view (e.g. 6am to 9pm)
  const displayPoints = data.allPoints.filter((p) => {
    const hr = parseInt(p.time.split(":")[0], 10);
    return hr >= 6 && hr <= 21;
  });

  if (displayPoints.length === 0) return null;

  const { windowStartHour, windowEndHour } = data;

  const allTemps = displayPoints.map((p) => p.temp);
  const minTemp = d3.min(allTemps) || 0;
  const maxTemp = d3.max(allTemps) || 100;

  // Ensure scales accommodate both temps and precipitation (0-100)
  const yMin = Math.min(minTemp - 5, 0);
  const yMax = Math.max(maxTemp + 5, 100);

  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = height - margin.top - margin.bottom;

  const pointsCount = displayPoints.length;

  const xScale = d3
    .scaleLinear()
    .domain([0, Math.max(1, pointsCount - 1)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

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

  const tempPath = tempLineGen(displayPoints) as string;
  const precipPath = precipLineGen(displayPoints) as string;

  const stateRef = useRef({ innerWidth, pointsCount, displayPoints, margin });
  useEffect(() => {
    stateRef.current = { innerWidth, pointsCount, displayPoints, margin };
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        initialTouchX.current = evt.nativeEvent.locationX;
        handleScrub(initialTouchX.current);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleScrub(initialTouchX.current + gestureState.dx);
      },
      onPanResponderRelease: () => {
        setScrubberIndex(null);
        lastHapticIndex.current = null;
      },
      onPanResponderTerminate: () => {
        setScrubberIndex(null);
        lastHapticIndex.current = null;
      },
    }),
  ).current;

  const handleScrub = (x: number) => {
    const latest = stateRef.current;
    if (latest.innerWidth === 0) return;
    const contentX = x - latest.margin.left;
    const continuousIndex =
      (contentX / latest.innerWidth) * (latest.pointsCount - 1);
    const result = calculateScrubberData(
      latest.displayPoints as any,
      continuousIndex,
    );

    setScrubberIndex(result.index);
    if (lastHapticIndex.current !== result.index) {
      lastHapticIndex.current = result.index;
      Haptics.selectionAsync().catch(() => {});
    }
  };

  let scrubResult: ScrubberResult | null = null;
  if (scrubberIndex !== null) {
    scrubResult = calculateScrubberData(displayPoints as any, scrubberIndex);
  }

  const formatScrubTime = (timeStr: string) => {
    if (!timeStr) return "";
    let [h, m] = timeStr.split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  // Find pixel X coords for window bounds
  let startX = 0;
  let endX = innerWidth;
  const startIndex = displayPoints.findIndex(
    (p) => parseInt(p.time.split(":")[0], 10) === windowStartHour,
  );
  const endIndex = displayPoints.findIndex(
    (p) => parseInt(p.time.split(":")[0], 10) === windowEndHour,
  );

  if (startIndex >= 0) startX = xScale(startIndex);
  if (endIndex >= 0) endX = xScale(endIndex);

  return (
    <View
      className="my-4"
      onLayout={onLayout}
      testID="forecast-chart-container"
    >
      {width > 0 && innerWidth > 0 && (
        <View {...panResponder.panHandlers} testID="chart-touch-surface">
          <Svg width={width} height={height} pointerEvents="none">
            <G x={margin.left} y={margin.top}>
              {/* Background Highlight for slot */}
              {startIndex >= 0 && endIndex >= 0 && (
                <Path
                  d={`M ${startX} 0 L ${endX} 0 L ${endX} ${innerHeight} L ${startX} ${innerHeight} Z`}
                  fill={palette.zinc[100]}
                />
              )}

              {/* Grid Lines */}
              {yScale.ticks(4).map((tick, i) => (
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

              {/* Highlight window boundaries */}
              {startIndex >= 0 && (
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
              {endIndex >= 0 && (
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
                const isSelected =
                  hour >= windowStartHour && hour <= windowEndHour;

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
                    {hour > 12
                      ? `${hour - 12}p`
                      : hour === 12
                        ? "12p"
                        : `${hour}a`}
                  </SvgText>
                );
              })}

              {/* Curves */}
              {tempPath && (
                <Path
                  d={tempPath}
                  fill="none"
                  stroke={baseColors.orange}
                  strokeWidth={3}
                />
              )}
              {precipPath && (
                <Path
                  d={precipPath}
                  fill="none"
                  stroke={baseColors.blue}
                  strokeWidth={3}
                />
              )}

              {/* Scrubber Tooltip */}
              {scrubResult && (
                <G>
                  <Line
                    x1={xScale(scrubResult.index)}
                    x2={xScale(scrubResult.index)}
                    y1={0}
                    y2={innerHeight}
                    stroke={palette.zinc[300]}
                    strokeWidth={1.5}
                    strokeDasharray="6,6"
                  />
                  <Circle
                    cx={xScale(scrubResult.index)}
                    cy={yScale(scrubResult.temp)}
                    r={5}
                    fill={baseColors.orange}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Circle
                    cx={xScale(scrubResult.index)}
                    cy={yScale(scrubResult.precip)}
                    r={5}
                    fill={baseColors.blue}
                    stroke="white"
                    strokeWidth={2}
                  />

                  <Rect
                    x={xScale(scrubResult.index) - 45}
                    y={innerHeight - 50}
                    width={90}
                    height={40}
                    rx={6}
                    fill={palette.zinc[800]}
                  />
                  <SvgText
                    x={xScale(scrubResult.index)}
                    y={innerHeight - 35}
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {formatScrubTime(scrubResult.time)}
                  </SvgText>
                  <SvgText
                    x={xScale(scrubResult.index)}
                    y={innerHeight - 16}
                    fill={palette.zinc[300]}
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {`${Math.round(scrubResult.temp)}°F | ${Math.round(scrubResult.precip)}%`}
                  </SvgText>
                </G>
              )}
            </G>
          </Svg>
        </View>
      )}
    </View>
  );
}
