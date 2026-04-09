import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useWeatherComparisonContext } from "../WeatherComparisonProvider";

export function WeatherLoadingState() {
	const { state } = useWeatherComparisonContext();
	const { isFetching, location } = state;

	if (!isFetching) return null;

	return (
		<View className="p-8 items-center justify-center">
			<ActivityIndicator className="text-primary" size="large" />
			<Text className="mt-4 text-muted-foreground">
				Fetching latest forecast for {location}...
			</Text>
		</View>
	);
}
