import React from 'react';
import { View, Text } from 'react-native';
import { WeatherSummary } from '../lib/weatherAnalyzer';
import { Sun, CloudRain, Wind, AlertCircle, CheckCircle } from 'lucide-react-native';

interface Props {
  title: string;
  date: Date;
  summary: WeatherSummary;
}

export default function ComparisonPanel({ title, date, summary }: Props) {
  const isGood = summary.recommendation === 'Good';
  const isMixed = summary.recommendation === 'Mixed';

  return (
    <View className="flex-1 p-4 m-2 bg-white rounded-xl shadow-sm border border-gray-100 min-w-[300px]">
      <Text className="text-xl font-bold text-gray-800 mb-1">{title}</Text>
      <Text className="text-sm text-gray-500 mb-4">{date.toDateString()}</Text>

      <View className="flex-row items-center justify-between mb-6">
        <View className="items-center">
          <Sun size={32} color={isGood ? '#f59e0b' : '#9ca3af'} />
          <Text className="text-2xl font-bold text-gray-800 mt-2">
            {Math.round(summary.minTemp)} - {Math.round(summary.maxTemp)}°F
          </Text>
        </View>

        <View className="items-end gap-2">
          <View className="flex-row items-center gap-1">
            <CloudRain size={16} color="#3b82f6" />
            <Text className="text-gray-600">{Math.round(summary.avgPrecipProb)}% precip</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Wind size={16} color="#6b7280" />
            <Text className="text-gray-600">{Math.round(summary.maxWindSpeed)} mph wind</Text>
          </View>
        </View>
      </View>

      <View className={`px-3 py-2 rounded-lg flex-row items-center gap-2 mb-4 ${
        isGood ? 'bg-green-100' : isMixed ? 'bg-yellow-100' : 'bg-red-100'
      }`}>
        {isGood ? <CheckCircle color="#16a34a" size={20} /> : <AlertCircle color={isMixed ? "#ca8a04" : "#dc2626"} size={20} />}
        <Text className={`font-semibold shrink ${
          isGood ? 'text-green-800' : isMixed ? 'text-yellow-800' : 'text-red-800'
        }`}>
          {summary.recommendation}
        </Text>
      </View>

      <Text className="text-gray-700 italic">"{summary.message}"</Text>
    </View>
  );
}
