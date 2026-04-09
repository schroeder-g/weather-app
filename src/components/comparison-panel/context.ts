import { createContext, use } from "react";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";

export interface ComparisonPanelContextValue {
	summary: WeatherSummary;
}

export const ComparisonPanelContext =
	createContext<ComparisonPanelContextValue | null>(null);

export function useComparisonPanelContext() {
	const context = use(ComparisonPanelContext);
	if (!context) {
		throw new Error(
			"ComparisonPanel compound components must be rendered within a ComparisonPanel.Root",
		);
	}
	return context;
}
