import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

import ComparisonPanel from "@/components/comparison-panel";
import ForecastChart from "@/components/ForecastChart";
import MessageBlast from "@/components/MessageBlast";
import TopBar from "@/components/TopBar";
import ChartLegendPopover from "@/components/forecast-chart/ChartLegendPopover";
import {
	WeatherComparisonProvider,
	useWeatherComparisonContext,
} from "@/features/weather/WeatherComparisonProvider";

function WeatherLayout() {
	const { state, actions } = useWeatherComparisonContext();
	const {
		isFetching,
		error,
		location,
		thisWeekResult,
		nextWeekResult,
		thisWeekDate,
		nextWeekDate,
		selectedWeek,
		isReady,
	} = state;

	return (
		<View className="flex-1 bg-white">
			<TopBar />

			<ScrollView
				className="flex-1 px-4 py-6"
				contentContainerStyle={{
					paddingBottom: 100,
					maxWidth: 1200,
					alignSelf: "center",
					width: "100%",
				}}
			>
				{isFetching && (
					<View className="p-8 items-center justify-center">
						<ActivityIndicator className="text-primary" size="large" />
						<Text className="mt-4 text-muted-foreground">
							Fetching latest forecast for {location}...
						</Text>
					</View>
				)}
				
				{/** Error State **/}
				{error && !isFetching && (
					<View className="bg-destructive/10 p-4 rounded-lg my-4 border border-destructive/20 items-center">
						<Text className="text-destructive font-semibold">
							Could not load weather data.
						</Text>
						<Text className="text-destructive/80 text-sm mt-1">
							Please ensure your location is valid and try again.
						</Text>
					</View>
				)}
				
				{/** Empty State **/}
				{!isFetching && !error && (!thisWeekResult || !nextWeekResult) && (
					<View className="p-8 items-center justify-center border-dashed border-2 border-border rounded-xl my-8">
						<Text className="text-muted-foreground">
							Pick a valid location and date within the next 15 days.
						</Text>
					</View>
				)}
				
				{/** Results View **/}
				{isReady && thisWeekResult && nextWeekResult && thisWeekDate && nextWeekDate && (
					<Animated.View
						entering={FadeIn.duration(400)}
						exiting={FadeOut}
						layout={LinearTransition.springify()}
					>
						<Animated.View
							layout={LinearTransition.springify()}
							className="flex-row flex-wrap sm:flex-nowrap justify-between gap-4 mt-2 mb-2"
						>
							<ComparisonPanel.Root
								summary={thisWeekResult}
								isSelected={selectedWeek === "this"}
								onPress={() => actions.setSelectedWeek("this")}
							>
								<ComparisonPanel.Header title="This Week" date={thisWeekDate} />
								<ComparisonPanel.Metrics />
								<ComparisonPanel.Recommendation />
								<ComparisonPanel.Summary />
							</ComparisonPanel.Root>
							<ComparisonPanel.Root
								summary={nextWeekResult}
								isSelected={selectedWeek === "next"}
								onPress={() => actions.setSelectedWeek("next")}
							>
								<ComparisonPanel.Header title="Next Week" date={nextWeekDate} />
								<ComparisonPanel.Metrics />
								<ComparisonPanel.Recommendation />
								<ComparisonPanel.Summary />
							</ComparisonPanel.Root>
						</Animated.View>

						<ForecastChart
							data={selectedWeek === "this" ? thisWeekResult : nextWeekResult}
						/>

						<View className="flex-row items-center justify-center gap-2 mt-4 mb-8 z-50">
							<Text className="text-2xl font-bold text-foreground">
								{selectedWeek === "this"
									? thisWeekDate.toLocaleDateString("en-US", {
											weekday: "long",
											month: "long",
											day: "numeric",
									  })
									: nextWeekDate.toLocaleDateString("en-US", {
											weekday: "long",
											month: "long",
											day: "numeric",
									  })}
							</Text>
							<ChartLegendPopover />
						</View>

						<MessageBlast />
					</Animated.View>
				)}
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
