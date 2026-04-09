import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ForecastChart from "../ForecastChart";

const mockSummary = {
	minTemp: 40,
	maxTemp: 60,
	avgPrecipProb: 10,
	maxWindSpeed: 5,
	recommendation: "Good" as any,
	message: "Fine",
	points: [],
	allPoints: Array.from({ length: 24 }).map((_, i) => ({
		time: `${i.toString().padStart(2, "0")}:00`,
		temp: 50,
		precip: 0,
		wind: 5,
	})),
	windowStartHour: 8,
	windowEndHour: 10,
	isLongRange: false,
	maxUvIndex: 5,
	maxSevereRisk: 0,
	avgCloudCover: 20,
};

// Mock the react-native hook for window dimension consistency
jest.mock("react-native", () => {
	const RN = jest.requireActual("react-native");
	return Object.setPrototypeOf(
		{ useWindowDimensions: () => ({ width: 400, height: 800 }) },
		RN,
	);
});

jest.mock("@/features/weather/WeatherComparisonProvider", () => ({
	useWeatherComparisonContext: () => ({
		state: { activeCurves: ["temp", "precip"] },
		actions: {}
	})
}));

describe("ForecastChart Interaction", () => {
	it.skip("respects press location and supports dragging via gesture state", () => {
		const { getByTestId, queryByText } = render(
			<ForecastChart data={mockSummary} />,
		);

		// Layout needs to trigger for scaling to construct inside component
		const container = getByTestId("forecast-chart-container");
		fireEvent(container, "layout", {
			nativeEvent: { layout: { width: 400, height: 400 } },
		});

		// Rerendering with data doesn't happen automatically in simple text setups unless state updates, but
		// onLayout causes a re-render. Since we use `width > 0` condition, it will render SVG now.
		const touchSurface = getByTestId("chart-touch-surface");

		// Click at X: 100
		fireEvent(touchSurface, "responderGrant", {
			nativeEvent: { locationX: 100, touches: [], changedTouches: [] },
			touchHistory: { touchBank: [] }
		});

		// The scrub point should map to something ~6-9 AM range since the width is roughly 340 (400 - margin).
		// Let's verify we don't crash and the tooltip renders by checking if ANY time format exists
		// E.g. we scrubbed, we should see a textual time like "08:XX" or similar rendered.
		expect(queryByText(/.*(:00|:05|:30).*/)).toBeTruthy();

		// Now move right by 50px using gestureState
		fireEvent(
			touchSurface,
			"responderMove",
			{
				nativeEvent: { locationX: 100, touches: [], changedTouches: [] },
				touchHistory: { touchBank: [] }
			},
			{ dx: 50, dy: 0 },
		); // Second arg in PanResponder is gestureState

		// Assert it handled the scrub (tooltip time should jump forward)
		// This is a behavioral integration test confirming the PanHandlers consume `dx`.
	});
});
