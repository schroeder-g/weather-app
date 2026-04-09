import { Info, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ChartInfoPopover() {
	const [open, setOpen] = useState(false);

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
				className="p-1 items-center justify-center opacity-70 hover:opacity-100"
				style={animatedStyle}
			>
				<Info size={20} className="text-muted-foreground" />
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
						<Text className="text-sm font-semibold text-foreground mb-4 text-center">
							Chart Info
						</Text>
						<Text className="text-sm text-foreground text-center leading-relaxed">
							The chart displays expected conditions based on selected weather
							data.
						</Text>
						<View className="flex-col items-center justify-center mt-4">
							<View className="flex-row items-center justify-center">
								<Text className="text-sm text-foreground">
									Use the configuration options (
								</Text>
								<View className="mx-1 border border-border bg-accent/30 rounded-md px-1 py-0.5">
									<SlidersHorizontal size={14} className="text-foreground" />
								</View>
								<Text className="text-sm text-foreground">)</Text>
							</View>
							<Text className="text-sm text-foreground text-center mt-1">
								to select which datasets are actively plotted!
							</Text>
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

export default ChartInfoPopover;
