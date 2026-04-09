import React from "react";
import { Text, View } from "react-native";
import { useWeatherComparisonContext } from "../WeatherComparisonProvider";

export function WeatherEmptyState() {
	const { state } = useWeatherComparisonContext();
	const { isFetching, error, thisWeekResult, nextWeekResult } = state;

	if (isFetching || error || (thisWeekResult && nextWeekResult)) return null;

	return (
		<View className="p-8 items-center justify-center border-dashed border-2 border-border rounded-xl my-8">
			<Text className="text-muted-foreground">
				Pick a valid location and date within the next 15 days.
			</Text>
		</View>
	);
}
