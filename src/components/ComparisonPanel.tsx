import {
	AlertCircle,
	CheckCircle,
	CloudRain,
	Sun,
	Wind,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";
import { baseColors } from "@/themes/config";

interface Props {
	title: string;
	date: Date;
	summary: WeatherSummary;
	isSelected?: boolean;
	onPress?: () => void;
}

export default function ComparisonPanel({ title, date, summary, isSelected, onPress }: Props) {
	const isGood = summary.recommendation === "Good";
	const isMixed = summary.recommendation === "Mixed";

	return (
		<Pressable 
			onPress={onPress}
			className={`w-full sm:flex-1 mb-[24px] min-w-[280px] bg-card rounded-2xl border transition-all duration-300 ${
				isSelected 
					? "border-primary shadow-sm shadow-primary/10 scale-[1.02]" 
					: "border-border shadow-none scale-100"
			}`}
		>
			<View className="p-4 rounded-2xl overflow-hidden bg-card">
				<Text className="text-xl font-bold text-foreground mb-1">{title}</Text>
				<Text className="text-sm text-muted-foreground mb-3">{date.toDateString()}</Text>

				<View className="flex-row items-center justify-between mb-5">
					<View className="items-center">
						<Sun size={32} color={isGood ? baseColors.orange : baseColors.zinc} />
						<Text className="text-2xl font-bold text-foreground mt-2">
							{Math.round(summary.minTemp)} - {Math.round(summary.maxTemp)}°F
						</Text>
					</View>

					<View className="items-end gap-2">
						<View className="flex-row items-center gap-2">
							<CloudRain size={16} color={baseColors.blue} />
							<Text className="text-muted-foreground font-medium">
								{Math.round(summary.avgPrecipProb)}% precip
							</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<Wind size={16} color={baseColors.zinc} />
							<Text className="text-muted-foreground font-medium">
								{Math.round(summary.maxWindSpeed)} mph wind
							</Text>
						</View>
					</View>
				</View>

				<View
					className={`px-4 py-2.5 rounded-xl flex-row items-center gap-2.5 mb-4 ${
						isGood ? "bg-green-50" : isMixed ? "bg-yellow-50" : "bg-red-50"
					}`}
				>
					{isGood ? (
						<CheckCircle color={baseColors.green} size={20} />
					) : (
						<AlertCircle color={isMixed ? baseColors.yellow : baseColors.red} size={20} />
					)}
					<Text
						className={`font-semibold text-base shrink ${
							isGood
								? "text-green-700"
								: isMixed
									? "text-yellow-700"
									: "text-red-700"
						}`}
					>
						{summary.recommendation}
					</Text>
				</View>

				<Text className="text-foreground italic leading-relaxed font-medium text-base">"{summary.message}"</Text>
			</View>
		</Pressable>
	);
}
