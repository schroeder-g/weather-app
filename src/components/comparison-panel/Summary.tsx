import React from "react";
import { Text } from "react-native";
import { useComparisonPanelContext } from "./context";

export function Summary() {
	const { summary } = useComparisonPanelContext();

	return (
		<Text className="text-foreground italic leading-relaxed font-medium text-base">
			"{summary.message}"
		</Text>
	);
}
