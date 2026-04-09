import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { setLocation } from "@/features/event/eventSlice";
import type { RootState } from "@/store/store";

export function LocationRow() {
	const dispatch = useDispatch();
	const { location, isLocating } = useSelector(
		(state: RootState) => state.event,
	);
	const [locInput, setLocInput] = useState(location);

	useEffect(() => {
		setLocInput(location);
	}, [location]);

	const handleLocationSubmit = () => {
		if (locInput !== location) {
			dispatch(setLocation(locInput));
		}
	};

	return (
		<View className="flex-row items-center gap-3 pr-4">
			{isLocating ? (
				<ActivityIndicator className="text-foreground" size="small" />
			) : (
				<MapPin className="text-foreground" size={26} />
			)}
			<TextInput
				className="flex-1 text-2xl font-bold text-foreground outline-none"
				value={locInput}
				onChangeText={setLocInput}
				onSubmitEditing={handleLocationSubmit}
				onBlur={handleLocationSubmit}
				placeholder="Choose location"
				placeholderTextColor="var(--muted-foreground)"
				editable={!isLocating}
			/>
		</View>
	);
}
