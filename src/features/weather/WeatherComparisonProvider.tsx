import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInitialLocation } from "@/features/event/eventSlice";
import { getSlotBounds, getUpcomingDates } from "@/lib/dateUtils";
import { analyzeWeatherWindow, type WeatherSummary } from "@/lib/weatherAnalyzer";
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
	selectedWeek: "this" | "next";
	isReady: boolean;
}

export interface WeatherComparisonActions {
	setSelectedWeek: (week: "this" | "next") => void;
}

export interface WeatherComparisonContextValue {
	state: WeatherComparisonState;
	actions: WeatherComparisonActions;
}

const WeatherComparisonContext = createContext<WeatherComparisonContextValue | null>(null);

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
				true,
			);

			return {
				thisWeekResult,
				nextWeekResult,
				thisWeekDate: thisWeek,
				nextWeekDate: nextWeek,
			};
		}, [data, dayOfWeek, timeSlot]);

	const isReady = !!(
		!isFetching &&
		!error &&
		thisWeekResult &&
		nextWeekResult &&
		thisWeekDate &&
		nextWeekDate
	);

	const value = {
		state: {
			location,
			isFetching,
			error,
			thisWeekResult,
			nextWeekResult,
			thisWeekDate,
			nextWeekDate,
			selectedWeek,
			isReady,
		},
		actions: {
			setSelectedWeek,
		},
	};

	return (
		<WeatherComparisonContext.Provider value={value}>
			{children}
		</WeatherComparisonContext.Provider>
	);
}
