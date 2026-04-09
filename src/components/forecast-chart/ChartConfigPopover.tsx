import { Check, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useWeatherComparisonContext } from "@/features/weather/WeatherComparisonProvider";
import { baseColors } from "@/themes/config";
import { AVAILABLE_CURVES, CURVE_DEFINITIONS } from "./config";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ChartConfigPopover() {
	const [open, setOpen] = useState(false);
	const { state, actions } = useWeatherComparisonContext();
	const activeCurves = state.activeCurves || [];

	const scale = useSharedValue(1);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<View>
			<AnimatedPressable
				onPressIn={() =>
					(scale.value = withSpring(0.95, { damping: 20, stiffness: 300 }))
				}
				onPressOut={() =>
					(scale.value = withSpring(1, { damping: 20, stiffness: 300 }))
				}
				onPress={() => setOpen(true)}
				className="p-2 rounded-full bg-card/80 border border-border shadow-sm items-center justify-center opacity-90 hover:opacity-100"
				style={animatedStyle}
				testID="open-config-btn"
			>
				<SlidersHorizontal size={18} className="text-foreground" />
			</AnimatedPressable>
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
						<Text className="text-sm font-semibold text-foreground mb-1 text-center">
							Chart Configuration
						</Text>
						<Text className="text-xs text-muted-foreground mb-4 text-center leading-relaxed">
							Select which expected conditions to plot.
						</Text>
						<View className="flex-col gap-4 w-full px-2">
							{AVAILABLE_CURVES.map((curveType) => {
								const config = CURVE_DEFINITIONS[curveType];
								const isActive = activeCurves.includes(curveType);

								return (
									<Pressable
										key={curveType}
										testID={`toggle-${curveType}`}
										className={`flex-row items-center justify-between p-3 rounded-xl border ${
											isActive
												? "border-border bg-accent/50"
												: "border-transparent"
										}`}
										onPress={() => actions.toggleCurve(curveType)}
									>
										<View className="flex-row items-center gap-3">
											<View
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: config.color }}
											/>
											<Text
												className={`text-sm ${
													isActive
														? "text-foreground font-medium"
														: "text-muted-foreground"
												}`}
											>
												{config.label}
											</Text>
										</View>
										{isActive ? (
											<Check size={16} color={baseColors.zinc} />
										) : null}
									</Pressable>
								);
							})}
						</View>
						<Pressable
							className="absolute top-2 right-2 p-2"
							onPress={() => setOpen(false)}
							testID="close-legend-btn"
						>
							<Text className="text-muted-foreground font-bold">✕</Text>
						</Pressable>
					</Pressable>
				</Pressable>
			</Modal>
		</View>
	);
}

export default ChartConfigPopover;
