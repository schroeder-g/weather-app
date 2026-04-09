import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TextInput, View, Text, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { setLocation, setCoordinates } from "@/features/event/eventSlice";
import type { RootState } from "@/store/store";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocationAutocomplete, Suggestion } from "@/hooks/useLocationAutocomplete";

export function LocationRow() {
	const dispatch = useDispatch();
	const { location, isLocating, coordinates } = useSelector(
		(state: RootState) => state.event,
	);
	
	const [locInput, setLocInput] = useState(location);
	const [isFocused, setIsFocused] = useState(false);
	
	const debouncedSearch = useDebounce(locInput, 400);

	const { data, isLoading, error, setQueryData } = useLocationAutocomplete(
		isFocused && debouncedSearch !== location ? debouncedSearch : "",
		coordinates?.latitude,
		coordinates?.longitude
	);

	useEffect(() => {
		setLocInput(location);
	}, [location]);

	const handleLocationSubmit = () => {
		// Only submit if the user actually changed the text
		if (locInput !== location && locInput.trim().length > 0) {
			dispatch(setLocation(locInput));
		} else if (locInput.trim().length === 0) {
			setLocInput(location); // revert if empty
		}
	};

	const handleSelectSuggestion = (suggestion: Suggestion) => {
		const newLocation = suggestion.formattedText;
		setLocInput(newLocation);
		dispatch(setLocation(newLocation));
		if (suggestion.coordinates) {
			dispatch(setCoordinates(suggestion.coordinates));
		}
		setQueryData([]); // clear suggestions
		setIsFocused(false);
		Keyboard.dismiss();
	};

	return (
		<View className="relative z-50">
			<View className="flex-row items-center gap-3 pr-4">
				{isLocating ? (
					<ActivityIndicator className="text-foreground" size="small" />
				) : (
					<MapPin className="text-foreground" size={26} />
				)}
				<TextInput
					testID="location-input"
					className="flex-1 text-2xl font-bold text-foreground outline-none py-2"
					value={locInput}
					onChangeText={setLocInput}
					onSubmitEditing={handleLocationSubmit}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// Allow time for the suggestion tap to register before removing the list
						setTimeout(() => setIsFocused(false), 200);
					}}
					placeholder="Choose location"
					placeholderTextColor="var(--muted-foreground)"
					editable={!isLocating}
				/>
			</View>

			{isFocused && (locInput !== location) && (debouncedSearch.length >= 2) && (
				<Animated.View 
					entering={FadeIn.duration(200)}
					exiting={FadeOut.duration(200)}
					className="absolute top-[48px] left-10 right-0 max-w-sm bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden max-h-64"
					style={{ elevation: 5 }}
				>
					{isLoading ? (
						<View className="p-4 items-center justify-center">
							<ActivityIndicator size="small" className="text-primary" />
							<Text className="text-muted-foreground mt-2 text-sm">Searching...</Text>
						</View>
					) : error ? (
						<View className="p-4">
							<Text className="text-destructive text-sm text-center">Failed to load suggestions.</Text>
						</View>
					) : data.length === 0 && debouncedSearch === locInput ? (
						<View className="p-4">
							<Text className="text-muted-foreground text-sm text-center">No locations found.</Text>
						</View>
					) : (
						<ScrollView keyboardShouldPersistTaps="handled">
							{data.map((item, index) => (
								<TouchableOpacity
									testID="location-suggestion-item"
									key={item.id}
									className={`p-4 flex-row items-start ${index < data.length - 1 ? 'border-b border-border/50' : ''}`}
									onPress={() => handleSelectSuggestion(item)}
								>
									<MapPin className="text-muted-foreground mr-3 mt-0.5" size={16} />
									<View className="flex-1">
										<Text className="text-foreground font-medium">{item.name}</Text>
										{item.formattedText !== item.name && (
											<Text className="text-muted-foreground text-sm mt-0.5" numberOfLines={1}>
												{item.formattedText}
											</Text>
										)}
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					)}
				</Animated.View>
			)}
		</View>
	);
}
