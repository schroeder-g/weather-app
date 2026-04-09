import {
	AlertCircle,
	AlertTriangle,
	CheckCircle,
	Cloud,
	CloudFog,
	CloudLightning,
	CloudRain,
	CloudSnow,
	CloudSun,
	Moon,
	Sun,
	Wind,
} from "lucide-react-native";
import React from "react";
import type { RecommendationSignal } from "@/lib/weatherAnalyzer";
import { baseColors } from "@/themes/config";

export function useRecommendationStyles(signal: RecommendationSignal) {
	switch (signal) {
		case "Ideal":
			return {
				bg: "bg-green-50",
				textClass: "text-green-700",
				iconColor: baseColors.green,
				Icon: CheckCircle,
			};
		case "Pleasant":
			return {
				bg: "bg-emerald-50",
				textClass: "text-emerald-700",
				iconColor: baseColors.green,
				Icon: CheckCircle,
			};
		case "Mixed":
			return {
				bg: "bg-yellow-50",
				textClass: "text-yellow-700",
				iconColor: baseColors.yellow,
				Icon: AlertCircle,
			};
		case "Poor":
			return {
				bg: "bg-orange-50",
				textClass: "text-orange-700",
				iconColor: baseColors.orange,
				Icon: AlertCircle,
			};
		case "Warning (Postpone)":
			return {
				bg: "bg-red-50",
				textClass: "text-red-700",
				iconColor: baseColors.red,
				Icon: AlertTriangle,
			};
		default:
			return {
				bg: "bg-zinc-100",
				textClass: "text-zinc-700",
				iconColor: baseColors.zinc,
				Icon: AlertCircle,
			};
	}
}

export function useWeatherIcon(
	iconName: string = "clear-day",
	size = 64,
	color: string = baseColors.zinc,
) {
	switch (iconName) {
		case "rain":
			return <CloudRain size={size} color={color} />;
		case "snow":
			return <CloudSnow size={size} color={color} />;
		case "cloudy":
			return <Cloud size={size} color={color} />;
		case "partly-cloudy-day":
		case "partly-cloudy-night":
			return <CloudSun size={size} color={color} />;
		case "fog":
			return <CloudFog size={size} color={color} />;
		case "wind":
			return <Wind size={size} color={color} />;
		case "thunder-rain":
		case "thunder-showers-day":
		case "thunder-showers-night":
			return <CloudLightning size={size} color={color} />;
		case "clear-night":
			return <Moon size={size} color={color} />;
		case "clear-day":
		default:
			return <Sun size={size} color={color} />;
	}
}
