import React from "react";
import { Text, View } from "react-native";
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from "react-native-reanimated";

import ComparisonPanel from "@/components/comparison-panel";
import ForecastChart from "@/components/forecast-chart";
import ChartConfigPopover from "@/components/forecast-chart/ChartConfigPopover";
import { FormattedDate } from "@/components/ui/FormattedDate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text as UIText } from "@/components/ui/text";
import { useWeatherComparisonContext } from "../WeatherComparisonProvider";

export function WeatherResultsState() {
	const { state, actions } = useWeatherComparisonContext();
	const {
		isReady,
		activeResult,
		activeDate,
		activeTitle,
		activePrefix,
		selectedWeek,
	} = state;

	if (!isReady || !activeResult || !activeDate) return null;

	return (
		<ComparisonPanel.Root
			summary={activeResult}
			date={activeDate}
			title={activeTitle}
		>
			<Animated.View
				entering={FadeIn.duration(400)}
				exiting={FadeOut}
				layout={LinearTransition.springify()}
			>
				<Animated.View layout={LinearTransition.springify()} className="my-1">
					<ComparisonPanel.Header />
					<ComparisonPanel.Metrics />
					<ComparisonPanel.Recommendation />
				</Animated.View>

				<View className="my-1 z-50 flex-row justify-start items-center w-full relative">
					<Tabs
						value={selectedWeek}
						onValueChange={(val) =>
							actions.setSelectedWeek(val as "this" | "next")
						}
					>
						<TabsList className="flex-row">
							<TabsTrigger value="this" testID="tab-this-week">
								<UIText>This week</UIText>
							</TabsTrigger>
							<TabsTrigger value="next" testID="tab-next-week">
								<UIText>Next week</UIText>
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<View className="flex-row items-center ml-3">
						<ChartConfigPopover />
					</View>
				</View>

				<ForecastChart data={activeResult} />

				<View className="flex-row items-center justify-center gap-2 mt-4 mb-8 z-50">
					<Text className="text-2xl font-bold text-foreground">
						{activePrefix}
						<FormattedDate
							date={activeDate}
							ordinalClassName="text-[14px] leading-5"
						/>
					</Text>
				</View>

				<Animated.View layout={LinearTransition.springify()}>
					<ComparisonPanel.Summary />
				</Animated.View>
			</Animated.View>
		</ComparisonPanel.Root>
	);
}
