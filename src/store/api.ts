import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DayData } from "@/lib/weatherAnalyzer";
import { getBaseApiUrl } from "@/lib/apiUtils";

export interface WeatherResponse {
	address: string;
	days: DayData[];
}

export const weatherApi = createApi({
	reducerPath: "weatherApi",
	baseQuery: fetchBaseQuery({
		baseUrl: getBaseApiUrl() + "/api/weather",
	}),
	endpoints: (builder) => ({
		getForecast: builder.query<WeatherResponse, string>({
			query: (location) => {
				return `?location=${encodeURIComponent(location)}`;
			},
		}),
	}),
});

export const { useGetForecastQuery } = weatherApi;
