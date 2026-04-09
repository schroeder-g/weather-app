import * as Clipboard from "expo-clipboard";
import { Copy } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useWeatherComparisonContext } from "@/features/weather/WeatherComparisonProvider";

export default function MessageBlast() {
	const { state } = useWeatherComparisonContext();
	const { location, thisWeekResult, nextWeekResult, thisWeekDate, nextWeekDate } = state;

	// Determine main copy for blast
	const isBlastNextWeek =
		thisWeekResult?.recommendation === "Warning (Postpone)" &&
		nextWeekResult?.recommendation !== "Warning (Postpone)";
	
	const blastDateStr = isBlastNextWeek
		? nextWeekDate?.toDateString()
		: thisWeekDate?.toDateString();
		
	const blastSummary = isBlastNextWeek
		? nextWeekResult?.message
		: thisWeekResult?.message;

	const blastText = `Hey everyone!

Upcoming meetup update for ${blastDateStr || ""} at ${location}:
${blastSummary || ""}

See you there!`;

	const handleCopy = async () => {
		await Clipboard.setStringAsync(blastText);
		alert("Copied to clipboard!");
	};

	return (
		<View className="my-6">
			<View className="flex-row items-center justify-between mb-4">
				<Text className="text-lg font-bold text-foreground">Message Blast</Text>
				<Pressable
					onPress={handleCopy}
					className="flex-row items-center gap-2 bg-secondary px-3 py-2 rounded-lg"
				>
					<Copy size={16} className="text-muted-foreground" />
					<Text className="text-sm font-semibold text-muted-foreground">Copy text</Text>
				</Pressable>
			</View>

			<View className="bg-card p-4 rounded-lg border border-border">
				<Text className="text-foreground text-base leading-6">{blastText}</Text>
			</View>
		</View>
	);
}
