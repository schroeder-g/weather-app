import React from "react";
import { Pressable, View } from "react-native";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import { ComparisonPanelContext } from "./context";

interface RootProps {
	summary: WeatherSummary;
	isSelected?: boolean;
	onPress?: () => void;
	children: React.ReactNode;
}

export function Root({
	summary,
	isSelected,
	onPress,
	children,
}: RootProps) {
	return (
		<ComparisonPanelContext value={{ summary }}>
			<Pressable
				onPress={onPress}
				className={`w-full sm:flex-1 mb-[24px] min-w-[280px] bg-card rounded-2xl border transition-all duration-300 ${
					isSelected
						? "border-primary shadow-sm shadow-primary/10 scale-[1.02]"
						: "border-border shadow-none scale-100"
				}`}
			>
				<View className="p-4 rounded-2xl overflow-hidden bg-card">
					{children}
				</View>
			</Pressable>
		</ComparisonPanelContext>
	);
}
