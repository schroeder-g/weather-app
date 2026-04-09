import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import type React from "react";
import { View } from "react-native";
import { ComparisonPanelContext } from "./context";

interface RootProps {
  summary: WeatherSummary;
  children: React.ReactNode;
}

export function Root({ summary, children }: RootProps) {
  return (
    <ComparisonPanelContext value={{ summary }}>
      <View className="w-full sm:flex-1 min-w-[280px]">
        <View className="p-4 pt-0 rounded-2xl overflow-hidden bg-transparent">
          {children}
        </View>
      </View>
    </ComparisonPanelContext>
  );
}
