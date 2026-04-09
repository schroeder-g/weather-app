import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FiltersRow } from "./top-bar/FiltersRow";
import { LocationRow } from "./top-bar/LocationRow";
import { TopBarHeader } from "./top-bar/TopBarHeader";

export default function TopBar() {
	const insets = useSafeAreaInsets();

	return (
		<View
			className="px-4 pb-4 bg-white border-b border-gray-200"
			style={{ paddingTop: Math.max(insets.top, 16) }}
		>
			<View className="flex-col gap-6">
				<TopBarHeader />
				<LocationRow />
				<FiltersRow />
			</View>
		</View>
	);
}
