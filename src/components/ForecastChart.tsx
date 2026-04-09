import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, G, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
import { WeatherSummary } from '@/lib/weatherAnalyzer';

interface Props {
  thisWeek: WeatherSummary;
  nextWeek: WeatherSummary;
}

export default function ForecastChart({ thisWeek, nextWeek }: Props) {
  const [width, setWidth] = useState(0);
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (!thisWeek.points.length && !nextWeek.points.length) {
    return <View onLayout={onLayout} className="h-[200px] flex items-center justify-center bg-gray-50 rounded-xl"><Text>No data</Text></View>;
  }

  // Extents for scales
  const allTemps = [...thisWeek.points.map(p => p.temp), ...nextWeek.points.map(p => p.temp)];
  const minTemp = d3.min(allTemps) || 0;
  const maxTemp = d3.max(allTemps) || 100;
  
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = height - margin.top - margin.bottom;

  const pointsCount = Math.max(thisWeek.points.length, nextWeek.points.length);

  const xScale = d3.scaleLinear()
    .domain([0, Math.max(1, pointsCount - 1)])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([minTemp - 5, maxTemp + 5]) // Adding padding
    .range([innerHeight, 0]);

  const lineGenerator = d3.line<any>()
    .x((d, i) => xScale(i)!)
    .y(d => yScale(d.temp)!)
    .curve(d3.curveMonotoneX);

  const thisWeekPath = thisWeek.points.length > 0 ? lineGenerator(thisWeek.points) as string : '';
  const nextWeekPath = nextWeek.points.length > 0 ? lineGenerator(nextWeek.points) as string : '';

  return (
    <View className="my-4" onLayout={onLayout}>
      <Text className="text-lg font-bold text-gray-800 mb-2">Forecast</Text>
      
      <View className="flex-row gap-4 mb-4">
        <View className="flex-row items-center gap-1">
          <View className="w-3 h-3 rounded-full bg-blue-500" />
          <Text className="text-gray-600 text-sm">This Week</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <View className="w-3 h-3 rounded-full bg-red-400" />
          <Text className="text-gray-600 text-sm">Next Week</Text>
        </View>
      </View>

      {width > 0 && innerWidth > 0 && (
        <Svg width={width} height={height}>
          <G x={margin.left} y={margin.top}>
            {/* Grid Lines */}
            {yScale.ticks(4).map((tick, i) => (
              <G key={`y-${tick}`}>
                <Line x1={0} x2={innerWidth} y1={yScale(tick)} y2={yScale(tick)} stroke="#e5e7eb" strokeDasharray="4,4" />
                <SvgText x={-5} y={yScale(tick) + 4} fontSize="10" fill="#6b7280" textAnchor="end">{tick}°</SvgText>
              </G>
            ))}

            {/* Time labels (approximate based on points mapping) */}
            {thisWeek.points.map((p, i) => (
               <SvgText key={`time-${i}`} x={xScale(i)} y={innerHeight + 20} fontSize="10" fill="#6b7280" textAnchor="middle">
                 {p.time}
               </SvgText>
            ))}

            {/* Curves */}
            {thisWeekPath && <Path d={thisWeekPath} fill="none" stroke="#3b82f6" strokeWidth={3} />}
            {nextWeekPath && <Path d={nextWeekPath} fill="none" stroke="#f87171" strokeWidth={3} />}
          </G>
        </Svg>
      )}
    </View>
  );
}
