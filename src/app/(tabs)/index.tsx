import { Info } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { baseColors } from "@/themes/config";
function ChartLegendPopover() {
	const [open, setOpen] = useState(false);
	return (
		<View>
			<Pressable onPress={() => setOpen(true)} className="p-1">
				<Info size={20} className="text-muted-foreground" />
			</Pressable>
			<Modal
				visible={open}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setOpen(false)}
			>
				<Pressable 
					className="flex-1 justify-center items-center bg-black/40"
					onPress={() => setOpen(false)}
				>
					<Pressable 
						className="bg-card w-11/12 max-w-sm p-6 rounded-2xl shadow-xl border border-border relative"
						onPress={(e) => e.stopPropagation()}
					>
						<Text className="text-sm text-foreground mb-4 text-center leading-relaxed">
							Chart displays expected conditions based on selected weather data.
						</Text>
						<View className="flex-col gap-3 w-full px-2">
							<View className="flex-row items-center gap-3">
								<View className="w-4 h-4 rounded-full" style={{ backgroundColor: baseColors.orange }} />
								<Text className="text-muted-foreground text-sm">Temperature (°F)</Text>
							</View>
							<View className="flex-row items-center gap-3">
								<View className="w-4 h-4 rounded-full" style={{ backgroundColor: baseColors.blue }} />
								<Text className="text-muted-foreground text-sm">Precipitation (%)</Text>
							</View>
						</View>
						<Pressable 
							className="absolute top-2 right-2 p-2" 
							onPress={() => setOpen(false)}
						>
							<Text className="text-muted-foreground font-bold">✕</Text>
						</Pressable>
					</Pressable>
				</Pressable>
			</Modal>
		</View>
	);
}
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import ComparisonPanel from "@/components/ComparisonPanel";
import ForecastChart from "@/components/ForecastChart";
import MessageBlast from "@/components/MessageBlast";
import TopBar from "@/components/TopBar";
import { fetchInitialLocation } from "@/features/event/eventSlice";
import { getSlotBounds, getUpcomingDates } from "@/lib/dateUtils";
import { analyzeWeatherWindow } from "@/lib/weatherAnalyzer";
import { useGetForecastQuery } from "@/store/api";
import type { AppDispatch, RootState } from "@/store/store";

export default function TabOneScreen() {
	const dispatch = useDispatch<AppDispatch>();
	const { location, dayOfWeek, timeSlot } = useSelector(
		(state: RootState) => state.event,
	);
	
	const [selectedWeek, setSelectedWeek] = useState<"this" | "next">("this");

	useEffect(() => {
		dispatch(fetchInitialLocation());
	}, [dispatch]);

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
				{!isFetching &&
					!error &&
					thisWeekResult &&
					nextWeekResult &&
					thisWeekDate &&
					nextWeekDate && (
						<Animated.View 
							entering={FadeIn.duration(400)} 
							exiting={FadeOut} 
							layout={LinearTransition.springify()}
						>
							<Animated.View layout={LinearTransition.springify()} className="flex-row flex-wrap sm:flex-nowrap justify-between gap-4 mt-2 mb-2">
								<ComparisonPanel
									title="This Week"
									date={thisWeekDate}
									summary={thisWeekResult}
									isSelected={selectedWeek === "this"}
									onPress={() => setSelectedWeek("this")}
								/>
								<ComparisonPanel
									title="Next Week"
									date={nextWeekDate}
									summary={nextWeekResult}
									isSelected={selectedWeek === "next"}
									onPress={() => setSelectedWeek("next")}
								/>
							</Animated.View>

							<ForecastChart
								data={selectedWeek === "this" ? thisWeekResult : nextWeekResult}
							/>

							<View className="flex-row items-center justify-center gap-2 mt-4 mb-8 z-50">
								<Text className="text-2xl font-bold text-foreground">
									{selectedWeek === "this"
										? thisWeekDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
										: nextWeekDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
								</Text>
								<ChartLegendPopover />
							</View>

							<MessageBlast
								location={location}
								dateStr={blastDateStr || ""}
								summaryMsg={blastSummary || ""}
							/>
						</Animated.View>
					)}
			</ScrollView>
		</View>
	);
}
