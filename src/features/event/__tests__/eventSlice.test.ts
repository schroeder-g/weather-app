import reducer, { setCoordinates, setLocation } from "../eventSlice";

describe("eventSlice", () => {
	const initialState = {
		location: "Dolores Park, SF",
		dayOfWeek: 1,
		timeSlot: "Afternoon" as const,
		isLocating: false,
		locationError: null,
		coordinates: null,
	};

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
});
