import React from "react";
import { Text, View } from "react-native";
import { useWeatherComparisonContext } from "../WeatherComparisonProvider";
import { getBaseApiUrl } from "@/lib/apiUtils";

export function WeatherErrorState() {
	const { state } = useWeatherComparisonContext();
	const { error, isFetching } = state;

	if (!error || isFetching) return null;

	return (
		<View className="bg-destructive/10 p-4 rounded-lg my-4 border border-destructive/20 items-center">
			<Text className="text-destructive font-semibold">
				Could not load weather data.
			</Text>
			<Text className="text-destructive/80 text-sm mt-1">
				{JSON.stringify(error)}
			</Text>
			<Text className="text-destructive/80 text-sm mt-1 font-mono">
				URL: {getBaseApiUrl()}
			</Text>
		</View>
	);
}
