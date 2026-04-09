import React from "react";
import { Text, View } from "react-native";
import { FormattedDate, formatTimeWindow } from "@/components/ui/FormattedDate";
import { useComparisonPanelContext } from "./context";

interface HeaderProps {
	title: string;
	date: Date;
}

export function Header({ title, date }: HeaderProps) {
	const { summary } = useComparisonPanelContext();
	const timeWindow = formatTimeWindow(
		summary.windowStartHour,
		summary.windowEndHour,
	);

	return (
		<View className="flex-row justify-between items-center mb-6">
			<View className="gap-0.5 flex-1 justify-center">
				<Text className="text-2xl font-bold text-foreground tracking-tight">
					{title}
				</Text>
				<FormattedDate
					date={date}
					className="text-sm font-medium text-muted-foreground mt-0.5"
				/>
				<Text className="text-sm font-medium text-muted-foreground/70">
					{timeWindow}
				</Text>
			</View>

			<View className="items-end justify-center pl-4">
				<Text className="text-4xl font-bold text-foreground tracking-tight">
					{Math.round(summary.minTemp)}
					<Text className="font-light text-zinc-500 mx-1">-</Text>
					{Math.round(summary.maxTemp)}°F
				</Text>
			</View>
		</View>
	);
}
