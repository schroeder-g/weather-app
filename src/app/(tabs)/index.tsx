import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import ComparisonPanel from "../../components/ComparisonPanel";
import ForecastChart from "../../components/ForecastChart";
import MessageBlast from "../../components/MessageBlast";
import TopBar from "../../components/TopBar";
import { getSlotBounds, getUpcomingDates } from "../../lib/dateUtils";
import { analyzeWeatherWindow } from "../../lib/weatherAnalyzer";
import { useGetForecastQuery } from "../../store/api";
import type { RootState } from "../../store/store";

export default function TabOneScreen() {
	const { location, dayOfWeek, timeSlot } = useSelector(
		(state: RootState) => state.event,
	);

	// RTK Query fetches
	const { data, error, isFetching } = useGetForecastQuery(location, {
		skip: !location,
	});

	const { thisWeekResult, nextWeekResult, thisWeekDate, nextWeekDate } =
		useMemo(() => {
			if (!data?.days)
				return {
					thisWeekResult: null,
					nextWeekResult: null,
					thisWeekDate: null,
					nextWeekDate: null,
				};

			const [thisWeek, nextWeek] = getUpcomingDates(dayOfWeek);

			// Find matching days in API response
			const thisWeekMatch = data.days.find(
				(d) =>
					new Date(d.datetime).toISOString().split("T")[0] ===
					thisWeek.toISOString().split("T")[0],
			);
			const nextWeekMatch = data.days.find(
				(d) =>
					new Date(d.datetime).toISOString().split("T")[0] ===
					nextWeek.toISOString().split("T")[0],
			);

			if (!thisWeekMatch || !nextWeekMatch) {
				return {
					thisWeekResult: null,
					nextWeekResult: null,
					thisWeekDate: thisWeek,
					nextWeekDate: nextWeek,
				};
			}

			const [start, end] = getSlotBounds(thisWeek, timeSlot);
			const startHour = start.getHours();
			const endHour = end.getHours();

			const thisWeekResult = analyzeWeatherWindow(
				thisWeekMatch,
				startHour,
				endHour,
			);
			const nextWeekResult = analyzeWeatherWindow(
				nextWeekMatch,
				startHour,
				endHour,
			);

			return {
				thisWeekResult,
				nextWeekResult,
				thisWeekDate: thisWeek,
				nextWeekDate: nextWeek,
			};
		}, [data, dayOfWeek, timeSlot]);

	// Determine main copy for blast
	const isBlastNextWeek =
		thisWeekResult?.recommendation === "Postpone Candidate" &&
		nextWeekResult?.recommendation !== "Postpone Candidate";
	const blastDateStr = isBlastNextWeek
		? nextWeekDate?.toDateString()
		: thisWeekDate?.toDateString();
	const blastSummary = isBlastNextWeek
		? nextWeekResult?.message
		: thisWeekResult?.message;

	return (
		<View className="flex-1 bg-gray-50">
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
						<ActivityIndicator size="large" color="#3b82f6" />
						<Text className="mt-4 text-gray-500">
							Fetching latest forecast for {location}...
						</Text>
					</View>
				)}
				{/** Error State **/}
				{error && !isFetching && (
					<View className="bg-red-50 p-4 rounded-lg my-4 border border-red-200 items-center">
						<Text className="text-red-600 font-semibold">
							Could not load weather data.
						</Text>
						<Text className="text-red-500 text-sm mt-1">
							Please ensure your location is valid and try again.
						</Text>
					</View>
				)}
				{/** Empty State **/}
				{!isFetching && !error && (!thisWeekResult || !nextWeekResult) && (
					<View className="p-8 items-center justify-center border-dashed border-2 border-gray-200 rounded-xl my-8">
						<Text className="text-gray-500">
							Pick a valid location and date within the next 15 days.
						</Text>
					</View>
				)}
				{/** Results View **/}
				{!isFetching &&
					!error &&
					thisWeekResult &&
					nextWeekResult &&
					thisWeekDate &&
					nextWeekDate && (
						<View>
							<View className="flex-row flex-wrap sm:flex-nowrap justify-between gap-4 mt-2">
								<ComparisonPanel
									title="This Week"
									date={thisWeekDate}
									summary={thisWeekResult}
								/>
								<ComparisonPanel
									title="Next Week"
									date={nextWeekDate}
									summary={nextWeekResult}
								/>
							</View>

							<ForecastChart
								thisWeek={thisWeekResult}
								nextWeek={nextWeekResult}
							/>

							<MessageBlast
								location={location}
								dateStr={blastDateStr || ""}
								summaryMsg={blastSummary || ""}
							/>
						</View>
					)}
			</ScrollView>
		</View>
	);
}
