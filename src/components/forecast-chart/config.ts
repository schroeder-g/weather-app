import { palette } from "@/themes/config";
import type { ProcessedPoint } from "@/lib/weatherAnalyzer";

export type DataCurveType = "temp" | "precip" | "wind" | "uv" | "aqi";

export interface CurveConfig {
	label: string;
	color: string;
	getValue: (d: ProcessedPoint) => number;
}

export const CURVE_DEFINITIONS: Record<DataCurveType, CurveConfig> = {
	temp: {
		label: "Temperature (°F)",
		color: palette.orange[500],
		getValue: (d) => d.temp,
	},
	precip: {
		label: "Precipitation (%)",
		color: palette.blue[500],
		getValue: (d) => d.precip,
	},
	wind: {
		label: "Wind Speed (mph)",
		color: palette.cyan[500],
		getValue: (d) => d.wind,
	},
	uv: {
		label: "UV Index",
		color: palette.purple[500],
		getValue: (d) => d.uv,
	},
	aqi: {
		label: "AQI (US)",
		color: palette.zinc[500],
		getValue: (d) => d.aqi,
	},
};

export const AVAILABLE_CURVES: DataCurveType[] = ["temp", "precip", "wind", "uv", "aqi"];
