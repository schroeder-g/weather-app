import React from "react";
import { Text, View } from "react-native";
import { useComparisonPanelContext } from "./context";
import { useRecommendationStyles } from "./hooks";

export function Recommendation() {
	const { summary } = useComparisonPanelContext();
	const { bg, textClass, iconColor, Icon } = useRecommendationStyles(
		summary.recommendation,
	);

	return (
		<View
			className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2.5 mb-4 ${bg}`}
		>
			<Icon color={iconColor} size={20} />
			<Text className={`font-semibold text-base shrink ${textClass}`}>
				{summary.recommendation}
			</Text>
		</View>
	);
}
