import type React from "react";
import { useMemo } from "react";
import { View } from "react-native";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import { ComparisonPanelContext } from "./context";

interface RootProps {
	summary: WeatherSummary;
	date: Date;
	title: string;
	children: React.ReactNode;
}

export function Root({ summary, date, title, children }: RootProps) {
	const value = useMemo(
		() => ({ summary, date, title }),
		[summary, date, title],
	);

	return (
		<ComparisonPanelContext value={value}>
			<View className="w-full sm:flex-1 min-w-[280px]">
				<View className="p-4 pt-0 rounded-2xl overflow-hidden bg-transparent">
					{children}
				</View>
			</View>
		</ComparisonPanelContext>
	);
}
