import { configureStore } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import reducer, { fetchInitialLocation, setCoordinates } from "./eventSlice";

jest.mock("expo-location");

describe("eventSlice", () => {
	const initialState = {
		location: "Dolores Park, SF",
		dayOfWeek: 1,
		timeSlot: "Afternoon" as const,
		isLocating: false,
		locationError: null,
		coordinates: null,
	};

	let originalFetch: typeof global.fetch;

	beforeAll(() => {
		originalFetch = global.fetch;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = jest.fn();
	});

	it("should return the initial state", () => {
		expect(reducer(undefined, { type: "unknown" }).coordinates).toEqual(null);
	});

	it("should handle setCoordinates", () => {
		const actual = reducer(
			initialState,
			setCoordinates({ latitude: 37.77, longitude: -122.41 }),
		);
		expect(actual.coordinates).toEqual({ latitude: 37.77, longitude: -122.41 });
	});

	describe("fetchInitialLocation", () => {
		let store: ReturnType<typeof configureStore>;

		beforeEach(() => {
			store = configureStore({
				reducer: { event: reducer },
			});
			(Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
				{ status: "granted" },
			);
			(Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue({
				coords: { latitude: 37.7749, longitude: -122.4194 },
			});
		});

		it("should use Location.reverseGeocodeAsync if it returns a valid place", async () => {
			(Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
				{ city: "San Francisco", region: "CA" },
			]);

			await store.dispatch(fetchInitialLocation() as any);

			const state = store.getState().event;
			expect(state.location).toBe("San Francisco, CA");
			expect(state.coordinates).toEqual({
				latitude: 37.7749,
				longitude: -122.4194,
			});
			expect(global.fetch).not.toHaveBeenCalled();
		});

		it("should fallback to the web reverse geocode API if expo-location reverse geocoding is empty", async () => {
			// Mock expo-location to return empty (what happens on web)
			(Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

			// Mock our fallback fetch API
			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => ({ locationName: "Mission District" }),
			});

			await store.dispatch(fetchInitialLocation() as any);

			expect(global.fetch).toHaveBeenCalledWith(
				"/api/location/reverse-geocode?lat=37.7749&lng=-122.4194"
			);

			const state = store.getState().event;
			expect(state.location).toBe("Mission District");
			expect(state.coordinates).toEqual({
				latitude: 37.7749,
				longitude: -122.4194,
			});
		});

		it("should fallback to the web reverse geocode API if expo-location reverse geocoding throws", async () => {
			// Mock expo-location to throw (sometimes happens on web or simulated envs)
			(Location.reverseGeocodeAsync as jest.Mock).mockRejectedValue(
				new Error("Not supported")
			);

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: true,
				json: async () => ({ locationName: "Mission District" }),
			});

			await store.dispatch(fetchInitialLocation() as any);

			expect(global.fetch).toHaveBeenCalledWith(
				"/api/location/reverse-geocode?lat=37.7749&lng=-122.4194"
			);

			const state = store.getState().event;
			expect(state.location).toBe("Mission District");
		});

        it("should reject if BOTH expo-location and the fallback API fail", async () => {
			(Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

			(global.fetch as jest.Mock).mockResolvedValue({
				ok: false,
			});

			await store.dispatch(fetchInitialLocation() as any);

			const state = store.getState().event;
			expect(state.location).toBe("Dolores Park, SF"); // Did not change
			expect(state.locationError).toBe("Could not determine location name");
		});
	});
});
