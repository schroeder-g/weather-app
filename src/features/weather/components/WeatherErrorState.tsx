import React from "react";
import { Text, View } from "react-native";
import { useWeatherComparisonContext } from "../WeatherComparisonProvider";

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
				Please ensure your location is valid and try again.
			</Text>
		</View>
	);
}
