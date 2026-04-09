import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { DataCurveType } from "@/components/forecast-chart/config";
import { fetchInitialLocation } from "@/features/event/eventSlice";
import { getSlotBounds, getUpcomingDates } from "@/lib/dateUtils";
import {
	analyzeWeatherWindow,
	type WeatherSummary,
} from "@/lib/weatherAnalyzer";
import { useGetForecastQuery } from "@/store/api";
import type { AppDispatch, RootState } from "@/store/store";

export interface WeatherComparisonState {
	location: string;
	isFetching: boolean;
	error: any;
	thisWeekResult: WeatherSummary | null;
	nextWeekResult: WeatherSummary | null;
	thisWeekDate: Date | null;
	nextWeekDate: Date | null;
	isAnalyzing: boolean;
	selectedWeek: "this" | "next";
	isReady: boolean;
	activeCurves: DataCurveType[];
	activeResult: WeatherSummary | null;
	activeDate: Date | null;
	activeTitle: string;
	activePrefix: string;
}

export interface WeatherComparisonActions {
	setSelectedWeek: (week: "this" | "next") => void;
	toggleCurve: (curve: DataCurveType) => void;
}

export interface WeatherComparisonContextValue {
	state: WeatherComparisonState;
	actions: WeatherComparisonActions;
}

const WeatherComparisonContext =
	createContext<WeatherComparisonContextValue | null>(null);

export function useWeatherComparisonContext() {
	const context = useContext(WeatherComparisonContext);
	if (!context) {
		throw new Error(
			"useWeatherComparisonContext must be used within a WeatherComparisonProvider",
		);
	}
	return context;
}

export function WeatherComparisonProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const dispatch = useDispatch<AppDispatch>();
	const { location, dayOfWeek, timeSlot } = useSelector(
		(state: RootState) => state.event,
	);

	const [selectedWeek, setSelectedWeek] = useState<"this" | "next">("this");
	const [activeCurves, setActiveCurves] = useState<DataCurveType[]>([
		"temp",
		"precip",
	]);

	const toggleCurve = (curve: DataCurveType) => {
		setActiveCurves((prev) =>
			prev.includes(curve) ? prev.filter((c) => c !== curve) : [...prev, curve],
		);
	};

	useEffect(() => {
		dispatch(fetchInitialLocation());
	}, [dispatch]);

	// RTK Query fetches
	const { data, error, isFetching } = useGetForecastQuery(location, {
		skip: !location,
	});

	const [thisWeekResult, setThisWeekResult] = useState<WeatherSummary | null>(
		null,
	);
	const [nextWeekResult, setNextWeekResult] = useState<WeatherSummary | null>(
		null,
	);
	const [thisWeekDate, setThisWeekDate] = useState<Date | null>(null);
	const [nextWeekDate, setNextWeekDate] = useState<Date | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	useEffect(() => {
		let isCancelled = false;

		const analyze = async () => {
			if (!data?.days) {
				setThisWeekResult(null);
				setNextWeekResult(null);
				setThisWeekDate(null);
				setNextWeekDate(null);
				return;
			}

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
				setThisWeekResult(null);
				setNextWeekResult(null);
				setThisWeekDate(thisWeek);
				setNextWeekDate(nextWeek);
				return;
			}

			setIsAnalyzing(true);
			const [start, end] = getSlotBounds(thisWeek, timeSlot);
			const startHour = start.getHours();
			const endHour = end.getHours();

			try {
				const [thisResult, nextResult] = await Promise.all([
					analyzeWeatherWindow(thisWeekMatch, startHour, endHour),
					analyzeWeatherWindow(nextWeekMatch, startHour, endHour, true),
				]);

				if (!isCancelled) {
					setThisWeekResult(thisResult);
					setNextWeekResult(nextResult);
					setThisWeekDate(thisWeek);
					setNextWeekDate(nextWeek);
				}
			} finally {
				if (!isCancelled) setIsAnalyzing(false);
			}
		};

		analyze();

		return () => {
			isCancelled = true;
		};
	}, [data, dayOfWeek, timeSlot]);

	const isReady = !!(
		!isFetching &&
		!isAnalyzing &&
		!error &&
		thisWeekResult &&
		nextWeekResult &&
		thisWeekDate &&
		nextWeekDate
	);

	const activeResult =
		selectedWeek === "this" ? thisWeekResult : nextWeekResult;
	const activeDate = selectedWeek === "this" ? thisWeekDate : nextWeekDate;
	const activeTitle = selectedWeek === "this" ? "This Week" : "Next Week";
	const activePrefix = selectedWeek === "this" ? "This " : "Next ";

	const value = useMemo(
		() => ({
			state: {
				location,
				isFetching,
				isAnalyzing,
				error,
				thisWeekResult,
				nextWeekResult,
				thisWeekDate,
				nextWeekDate,
				selectedWeek,
				isReady,
				activeCurves,
				activeResult,
				activeDate,
				activeTitle,
				activePrefix,
			},
			actions: {
				setSelectedWeek,
				toggleCurve,
			},
		}),
		[
			location,
			isFetching,
			isAnalyzing,
			error,
			thisWeekResult,
			nextWeekResult,
			thisWeekDate,
			nextWeekDate,
			selectedWeek,
			isReady,
			activeCurves,
			activeResult,
			activeDate,
			activeTitle,
			activePrefix,
		],
	);

	return (
		<WeatherComparisonContext.Provider value={value}>
			{children}
		</WeatherComparisonContext.Provider>
	);
}
