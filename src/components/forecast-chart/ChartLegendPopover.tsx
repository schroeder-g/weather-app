import { Info } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { baseColors } from "@/themes/config";

export function ChartLegendPopover() {
	const [open, setOpen] = useState(false);
	return (
		<View>
			<Pressable onPress={() => setOpen(true)} className="p-1">
				<Info size={20} className="text-muted-foreground" />
			</Pressable>
			<Modal
				visible={open}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setOpen(false)}
			>
				<Pressable 
					className="flex-1 justify-center items-center bg-black/40"
					onPress={() => setOpen(false)}
				>
					<Pressable 
						className="bg-card w-11/12 max-w-sm p-6 rounded-2xl shadow-xl border border-border relative"
						onPress={(e) => e.stopPropagation()}
					>
						<Text className="text-sm text-foreground mb-4 text-center leading-relaxed">
							Chart displays expected conditions based on selected weather data.
						</Text>
						<View className="flex-col gap-3 w-full px-2">
							<View className="flex-row items-center gap-3">
								<View className="w-4 h-4 rounded-full" style={{ backgroundColor: baseColors.orange }} />
								<Text className="text-muted-foreground text-sm">Temperature (°F)</Text>
							</View>
							<View className="flex-row items-center gap-3">
								<View className="w-4 h-4 rounded-full" style={{ backgroundColor: baseColors.blue }} />
								<Text className="text-muted-foreground text-sm">Precipitation (%)</Text>
							</View>
						</View>
						<Pressable 
							className="absolute top-2 right-2 p-2" 
							onPress={() => setOpen(false)}
						>
							<Text className="text-muted-foreground font-bold">✕</Text>
						</Pressable>
					</Pressable>
				</Pressable>
			</Modal>
		</View>
	);
}

export default ChartLegendPopover;
