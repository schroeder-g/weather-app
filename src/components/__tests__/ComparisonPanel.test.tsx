import { render, screen } from "@testing-library/react-native";
import React from "react";
import ComparisonPanel from "../ComparisonPanel";

jest.mock('expo-linear-gradient', () => ({
	LinearGradient: 'LinearGradient'
}));

const mockSummary = {
	minTemp: 60,
	maxTemp: 75,
	avgPrecipProb: 10,
	maxWindSpeed: 5,
	recommendation: "Good",
	message: "Looking pristine",
	hourlyForecasts: []
};

describe("ComparisonPanel", () => {
	it("renders 'Good' recommendations with warm gradients", () => {
		render(<ComparisonPanel title="Test" date={new Date()} summary={mockSummary as any} />);
		
		const gradient = screen.UNSAFE_getByType('LinearGradient');
		expect(gradient.props.colors).toEqual(["#fffbeb", "#fde68a"]);
		expect(screen.getByText("Looking pristine")).toBeTruthy();
	});

	it("renders 'Mixed' recommendations with mixed gradient", () => {
		const mixedSummary = { ...mockSummary, recommendation: "Mixed", message: "Bring a jacket" };
		render(<ComparisonPanel title="Test" date={new Date()} summary={mixedSummary as any} />);

		const gradient = screen.UNSAFE_getByType('LinearGradient');
		expect(gradient.props.colors).toEqual(["#fefce8", "#fef08a"]);
		expect(screen.getByText("Bring a jacket")).toBeTruthy();
	});

	it("renders 'Postpone Candidate' recommendations with moody blues gradient", () => {
		const badSummary = { ...mockSummary, recommendation: "Postpone Candidate", message: "Storms incoming" };
		render(<ComparisonPanel title="Test" date={new Date()} summary={badSummary as any} />);

		const gradient = screen.UNSAFE_getByType('LinearGradient');
		expect(gradient.props.colors).toEqual(["#f8fafc", "#e2e8f0"]);
		expect(screen.getByText("Storms incoming")).toBeTruthy();
	});
});
