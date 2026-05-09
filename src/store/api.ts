import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseApiUrl } from "@/lib/apiUtils";
import type { DayData } from "@/lib/weatherAnalyzer";

export interface WeatherResponse {
	address: string;
	days: DayData[];
}

export const weatherApi = createApi({
	reducerPath: "weatherApi",
	baseQuery: fetchBaseQuery({
		baseUrl: getBaseApiUrl() + "/api/weather",
		prepareHeaders: (headers) => {
			// Bypass the free-tier Ngrok HTML warning so JSON parsing doesn't fail
			headers.set("ngrok-skip-browser-warning", "69420");
			return headers;
		},
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
