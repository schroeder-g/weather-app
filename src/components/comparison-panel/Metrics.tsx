import {
	AlertTriangle,
	CloudRain,
	ThermometerSun,
	Wind,
} from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { baseColors } from "@/themes/config";
import { useComparisonPanelContext } from "./context";
import { useWeatherIcon } from "./hooks";

export function Metrics() {
	const { summary } = useComparisonPanelContext();
	const isLongRange = summary.isLongRange;

	const primaryIconColor =
		summary.recommendation === "Ideal" || summary.recommendation === "Pleasant"
			? baseColors.orange
			: baseColors.zinc;

	return (
		<View className="flex-row justify-between items-end mb-6">
			<View className="ml-2">
				{useWeatherIcon(summary.primaryIcon, 64, primaryIconColor)}
			</View>

			<View className="gap-y-2 ml-4">
				<View className="flex-row items-center gap-2">
					<Wind size={16} color={baseColors.zinc} />
					<Text className="text-muted-foreground font-medium">
						{Math.round(summary.maxWindSpeed)} mph wind
					</Text>
				</View>
				<View className="flex-row items-center gap-2">
					<CloudRain size={16} color={baseColors.blue} />
					<Text className="text-muted-foreground font-medium">
						{Math.round(summary.avgPrecipProb)}% chance of rain
					</Text>
				</View>
				{summary.maxUvIndex >= 8 && (
					<View className="flex-row items-center gap-2">
						<ThermometerSun size={16} color={baseColors.orange} />
						<Text className="text-orange-600 font-medium">
							Extreme UV Index ({summary.maxUvIndex})
						</Text>
					</View>
				)}
				{summary.maxSevereRisk >= (isLongRange ? 55 : 20) && (
					<View className="flex-row items-center gap-2">
						<AlertTriangle size={16} color={baseColors.red} />
						<Text className="text-red-600 font-medium">
							{isLongRange
								? "Severe Weather risk"
								: `Severe Weather risk ${summary.maxSevereRisk}/100`}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
}
