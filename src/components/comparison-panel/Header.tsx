import React from "react";
import { Text, View } from "react-native";
import { useComparisonPanelContext } from "./context";
import { FormattedDate, formatTimeWindow } from "@/components/ui/FormattedDate";

interface HeaderProps {
	title: string;
	date: Date;
}

export function Header({ title, date }: HeaderProps) {
	const { summary } = useComparisonPanelContext();
	const timeWindow = formatTimeWindow(summary.windowStartHour, summary.windowEndHour);

	return (
		<View className="flex-row justify-between items-start mb-6">
			<View className="gap-1 flex-1">
				<Text className="text-xl font-bold text-foreground">{title}</Text>
				<FormattedDate 
					date={date} 
					className="text-sm text-muted-foreground"
					appendString={`, ${timeWindow}`}
				/>
			</View>

			<View className="items-end justify-start pl-4">
				<Text className="text-4xl font-bold text-foreground tracking-tight">
					{Math.round(summary.minTemp)}
					<Text className="font-normal text-zinc-500 mx-1">-</Text>
					{Math.round(summary.maxTemp)}°F
				</Text>
			</View>
		</View>
	);
}
