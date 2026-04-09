import { BlurView } from "expo-blur";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FiltersRow } from "./top-bar/FiltersRow";
import { LocationRow } from "./top-bar/LocationRow";
import { TopBarHeader } from "./top-bar/TopBarHeader";

export default function TopBar() {
	const insets = useSafeAreaInsets();

	return (
		<BlurView
			intensity={80}
			tint="light"
			className="px-4 pb-4 border-b border-gray-200/50 shadow-sm z-10 bg-white/60 web:backdrop-blur-md"
			style={{ paddingTop: Math.max(insets.top, 16) }}
		>
			<View className="flex-col gap-4">
				<TopBarHeader />
				<LocationRow />
				<FiltersRow />
			</View>
		</BlurView>
	);
}

