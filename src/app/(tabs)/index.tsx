import React from "react";
import { ScrollView, View } from "react-native";

import TopBar from "@/components/top-bar";
import { WeatherEmptyState } from "@/features/weather/components/WeatherEmptyState";
import { WeatherErrorState } from "@/features/weather/components/WeatherErrorState";
import { WeatherLoadingState } from "@/features/weather/components/WeatherLoadingState";
import { WeatherResultsState } from "@/features/weather/components/WeatherResultsState";
import { WeatherComparisonProvider } from "@/features/weather/WeatherComparisonProvider";

function WeatherLayout() {
	return (
		<View className="flex-1 bg-white">
			<TopBar />

			<ScrollView
				className="flex-1 px-4 py-6"
				contentContainerStyle={{
					paddingBottom: 80,
					maxWidth: 1200,
					alignSelf: "center",
					width: "100%",
				}}
			>
				<WeatherLoadingState />
				<WeatherErrorState />
				<WeatherEmptyState />
				<WeatherResultsState />
			</ScrollView>
		</View>
	);
}

export default function TabOneScreen() {
	return (
		<WeatherComparisonProvider>
			<WeatherLayout />
		</WeatherComparisonProvider>
	);
}
