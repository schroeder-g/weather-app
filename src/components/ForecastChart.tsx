import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import * as d3 from "d3";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Svg, { G, Line, Path, Text as SvgText } from "react-native-svg";

interface Props {
  data: WeatherSummary;
}

export default function ForecastChart({ data }: Props) {
  const [width, setWidth] = useState(0);
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (!data || !data.allPoints || data.allPoints.length === 0) {
    return (
      <View
        onLayout={onLayout}
        className="h-[200px] flex items-center justify-center bg-gray-50 rounded-xl"
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
    <View className="my-4" onLayout={onLayout}>
      <View className="flex-row gap-4 mb-4 justify-center">
        <View className="flex-row items-center gap-1">
          <View className="w-3 h-3 rounded-full bg-orange-500" />
          <Text className="text-gray-600 text-sm">Temperature</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="w-3 h-3 rounded-full bg-blue-500" />
          <Text className="text-gray-600 text-sm">Precipitation</Text>
        </View>
      </View>

      {width > 0 && innerWidth > 0 && (
        <Svg width={width} height={height}>
          <G x={margin.left} y={margin.top}>
            {/* Background Highlight for slot */}
            {startIndex >= 0 && endIndex >= 0 && (
              <Path
                d={`M ${startX} 0 L ${endX} 0 L ${endX} ${innerHeight} L ${startX} ${innerHeight} Z`}
                fill="#f3f4f6"
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
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <SvgText
                  x={-5}
                  y={yScale(tick) + 4}
                  fontSize="10"
                  fill="#6b7280"
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
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
            )}
            {endIndex >= 0 && (
              <Line
                x1={endX}
                x2={endX}
                y1={0}
                y2={innerHeight}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="4,4"
              />
            )}

            {/* Time labels */}
            {displayPoints.map((p, i) => {
              const hour = parseInt(p.time.split(":")[0], 10);
              const isSelected =
                hour >= windowStartHour && hour <= windowEndHour;

              // Only show even hours to prevent crowding
              if (hour % 2 !== 0 && !isSelected) return null;

              return (
                <SvgText
                  key={`time-${i}`}
                  x={xScale(i)}
                  y={innerHeight + 20}
                  fontSize="10"
                  fill={isSelected ? "#1f2937" : "#6b7280"}
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
                stroke="#f97316" // Orange 500
                strokeWidth={3}
              />
            )}
            {precipPath && (
              <Path
                d={precipPath}
                fill="none"
                stroke="#3b82f6" // Blue 500
                strokeWidth={3}
              />
            )}
          </G>
        </Svg>
      )}
    </View>
  );
}
