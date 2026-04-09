import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { useWeatherComparisonContext } from "@/features/weather/WeatherComparisonProvider";
import ChartConfigPopover from "./ChartConfigPopover";

jest.mock("@/features/weather/WeatherComparisonProvider", () => ({
	useWeatherComparisonContext: jest.fn(),
}));

jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock");
	Reanimated.default.call = () => {};
	return {
		...Reanimated,
		useSharedValue: jest.fn(() => ({ value: 1 })),
		useAnimatedStyle: jest.fn(() => ({})),
		withSpring: jest.fn((v) => v),
	};
});

describe("ChartConfigPopover", () => {
	it("renders available curves and calls toggleCurve when pressed", () => {
		const mockToggleCurve = jest.fn();
		(useWeatherComparisonContext as jest.Mock).mockReturnValue({
			state: { activeCurves: ["temp"] },
			actions: { toggleCurve: mockToggleCurve },
		});

		const { getByTestId, getByText } = render(<ChartConfigPopover />);

		// Open modal
		fireEvent.press(getByTestId("open-config-btn"));

		// Check elements
		expect(getByText("Temperature (°F)")).toBeTruthy();
		expect(getByText("Precipitation (%)")).toBeTruthy();
		expect(getByText("Wind Speed (mph)")).toBeTruthy();

		// Press precip toggle
		const precipToggle = getByTestId("toggle-precip");
		fireEvent.press(precipToggle);

		expect(mockToggleCurve).toHaveBeenCalledWith("precip");
	});
});
