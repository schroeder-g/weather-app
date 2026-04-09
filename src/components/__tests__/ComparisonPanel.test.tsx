import { render, screen } from "@testing-library/react-native";
import React from "react";
import ComparisonPanel from "../comparison-panel";

const mockSummary = {
	minTemp: 60,
	maxTemp: 75,
	avgPrecipProb: 10,
	maxWindSpeed: 5,
	maxUvIndex: 2,
	maxSevereRisk: 0,
	avgCloudCover: 0,
	recommendation: "Ideal",
	message: "Looking pristine",
	primaryIcon: "clear-day",
	primaryConditions: "Clear",
	points: [],
	allPoints: [],
	windowStartHour: 8,
	windowEndHour: 12,
};

function TestWrapper({
	summary,
	title = "Test",
	date = new Date(),
}: {
	summary: any;
	title?: string;
	date?: Date;
}) {
	return (
		<ComparisonPanel.Root summary={summary}>
			<ComparisonPanel.Header title={title} date={date} />
			<ComparisonPanel.Metrics />
			<ComparisonPanel.Recommendation />
			<ComparisonPanel.Summary />
		</ComparisonPanel.Root>
	);
}

describe("ComparisonPanel", () => {
	it("renders 'Ideal' recommendations properly", () => {
		render(<TestWrapper summary={mockSummary} />);

		expect(screen.getByText("Ideal")).toBeTruthy();
		expect(screen.getByText('"Looking pristine"')).toBeTruthy();
	});

	it("renders 'Pleasant' recommendations", () => {
		const mixedSummary = {
			...mockSummary,
			recommendation: "Pleasant",
			message: "Bring a light jacket",
		};
		render(<TestWrapper summary={mixedSummary} />);

		expect(screen.getByText("Pleasant")).toBeTruthy();
		expect(screen.getByText('"Bring a light jacket"')).toBeTruthy();
	});

	it("renders 'Warning (Postpone)' recommendations", () => {
		const badSummary = {
			...mockSummary,
			recommendation: "Warning (Postpone)",
			message: "Severe storms incoming",
		};
		render(<TestWrapper summary={badSummary} />);

		expect(screen.getByText("Warning (Postpone)")).toBeTruthy();
		expect(screen.getByText('"Severe storms incoming"')).toBeTruthy();
	});

	it("renders a skeleton loader while message is resolving", async () => {
		let resolveMessage!: (msg: string) => void;
		const messagePromise = new Promise<string>((resolve) => {
			resolveMessage = resolve;
		});

		const loadingSummary = {
			...mockSummary,
			message: messagePromise,
		};

		render(<TestWrapper summary={loadingSummary} />);

		// Test for skeleton indicator
		expect(screen.getByTestId("summary-skeleton")).toBeTruthy();

		// Resolve the promise
		resolveMessage("Loaded message");

		// Wait for message to appear
		const msg = await screen.findByText('"Loaded message"');
		expect(msg).toBeTruthy();
	});
});
