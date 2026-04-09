import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import eventReducer from "@/features/event/eventSlice";
import identityReducer from "@/features/identity/identitySlice";
import { weatherApi } from "./api";

export const store = configureStore({
	reducer: {
		[weatherApi.reducerPath]: weatherApi.reducer,
		event: eventReducer,
		identity: identityReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(weatherApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
