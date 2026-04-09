import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DayData } from '@/lib/weatherAnalyzer';

export interface WeatherResponse {
  address: string;
  days: DayData[];
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' }),
  endpoints: (builder) => ({
    getForecast: builder.query<WeatherResponse, string>({
      query: (location) => {
        const apiKey = process.env.EXPO_PUBLIC_VISUAL_CROSSING_API_KEY || '';
        return `${encodeURIComponent(location)}/next15days?unitGroup=us&include=hours,days&key=${apiKey}&contentType=json`;
      },
    }),
  }),
});

export const { useGetForecastQuery } = weatherApi;
