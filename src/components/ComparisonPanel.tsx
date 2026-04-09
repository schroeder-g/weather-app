import {
	AlertCircle,
	CheckCircle,
	CloudRain,
	Sun,
	Wind,
} from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { WeatherSummary } from "@/lib/weatherAnalyzer";

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
			className={`w-full sm:flex-1 mb-6 min-w-[280px] bg-white rounded-2xl shadow-md border ${
				isSelected ? "border-blue-500/50 shadow-blue-500/20" : "border-slate-100 shadow-slate-200/50"
			}`}
			style={{
				shadowColor: isSelected ? "#3b82f6" : "#475569",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.15,
				shadowRadius: 12,
				elevation: 4,
			}}
		>
			<View className="p-4 rounded-2xl overflow-hidden bg-white">
				<Text className="text-xl font-bold text-slate-800 mb-1">{title}</Text>
				<Text className="text-sm text-slate-500 mb-3">{date.toDateString()}</Text>

				<View className="flex-row items-center justify-between mb-5">
					<View className="items-center">
						<Sun size={32} color={isGood ? "#f59e0b" : "#9ca3af"} />
						<Text className="text-2xl font-bold text-slate-800 mt-2">
							{Math.round(summary.minTemp)} - {Math.round(summary.maxTemp)}°F
						</Text>
					</View>

					<View className="items-end gap-2">
						<View className="flex-row items-center gap-2">
							<CloudRain size={16} color="#3b82f6" />
							<Text className="text-slate-600 font-medium">
								{Math.round(summary.avgPrecipProb)}% precip
							</Text>
						</View>
						<View className="flex-row items-center gap-2">
							<Wind size={16} color="#64748b" />
							<Text className="text-slate-600 font-medium">
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
						<CheckCircle color="#16a34a" size={20} />
					) : (
						<AlertCircle color={isMixed ? "#ca8a04" : "#dc2626"} size={20} />
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

				<Text className="text-slate-600 italic leading-relaxed font-medium text-base">"{summary.message}"</Text>
			</View>
		</Pressable>
	);
}
