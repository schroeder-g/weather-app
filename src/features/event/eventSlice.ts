import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import * as Location from "expo-location";
import type { DayOfWeek, TimeSlot } from "@/lib/dateUtils";

interface EventState {
	location: string;
	dayOfWeek: DayOfWeek;
	timeSlot: TimeSlot;
	isLocating: boolean;
	locationError: string | null;
}

const initialState: EventState = {
	location: "Dolores Park, SF",
	dayOfWeek: new Date().getDay(),
	timeSlot: "Afternoon",
	isLocating: false,
	locationError: null,
};

export const fetchInitialLocation = createAsyncThunk(
	"event/fetchInitialLocation",
	async (_, { rejectWithValue }) => {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				return rejectWithValue("Permission to access location was denied");
			}

			// Helper to wrap promises with a timeout
			const withTimeout = <T>(promise: Promise<T>, ms: number) => {
				return Promise.race([
					promise,
					new Promise<never>((_, reject) =>
						setTimeout(
							() => reject(new Error("Location request timed out")),
							ms,
						),
					),
				]);
			};

			// Try last known position first (fastest)
			let location = await Location.getLastKnownPositionAsync();
			if (!location) {
				location = await withTimeout(
					Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced,
					}),
					5000, // 5s timeout
				);
			}

			const geocode = await withTimeout(
				Location.reverseGeocodeAsync({
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				}),
				5000, // 5s timeout
			);

			if (geocode && geocode.length > 0) {
				const place = geocode[0];
				const city = place.city || place.subregion || place.name;
				const region = place.region;
				if (city && region) {
					return `${city}, ${region}`;
				} else if (city) {
					return city;
				}
			}
			return rejectWithValue("Could not determine location name");
		} catch (error) {
			return rejectWithValue((error as Error).message);
		}
	},
);

export const eventSlice = createSlice({
	name: "event",
	initialState,
	reducers: {
		setLocation: (state, action: PayloadAction<string>) => {
			state.location = action.payload;
		},
		setDayOfWeek: (state, action: PayloadAction<DayOfWeek>) => {
			state.dayOfWeek = action.payload;
		},
		setTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
			state.timeSlot = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchInitialLocation.pending, (state) => {
				state.isLocating = true;
				state.locationError = null;
			})
			.addCase(fetchInitialLocation.fulfilled, (state, action) => {
				state.isLocating = false;
				if (action.payload) {
					state.location = action.payload;
				}
			})
			.addCase(fetchInitialLocation.rejected, (state, action) => {
				state.isLocating = false;
				state.locationError = action.payload as string;
			});
	},
});

export const { setLocation, setDayOfWeek, setTimeSlot } = eventSlice.actions;
export default eventSlice.reducer;
