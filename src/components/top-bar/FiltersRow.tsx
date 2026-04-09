import { Clock } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { setDayOfWeek, setTimeSlot } from "@/features/event/eventSlice";
import type { TimeSlot } from "@/lib/dateUtils";
import type { RootState } from "@/store/store";

const fullDays = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];
const slots: TimeSlot[] = ["Morning", "Afternoon", "Evening"];

export function FiltersRow() {
	const dispatch = useDispatch();
	const { dayOfWeek, timeSlot } = useSelector(
		(state: RootState) => state.event,
	);
	const insets = useSafeAreaInsets();

	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	return (
		<View className="flex-row items-center gap-3">
			<Clock color="#1f2937" size={24} />

			<Select
				value={{
					value: dayOfWeek.toString(),
					label: `Every ${fullDays[dayOfWeek]}`,
				}}
				onValueChange={(option) => {
					if (option) dispatch(setDayOfWeek(parseInt(option.value)));
				}}
			>
				<SelectTrigger className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none bg-transparent h-auto px-0 py-0 min-w-0">
					<SelectValue
						className="text-xl text-gray-800 font-medium"
						placeholder="Select..."
					/>
				</SelectTrigger>
				<SelectContent insets={contentInsets} className="w-48 native:w-56">
					<SelectGroup>
						{fullDays.map((day, i) => (
							<SelectItem key={i} label={day} value={i.toString()}>
								<Text>{day}</Text>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>

			<Select
				value={{ value: timeSlot, label: timeSlot }}
				onValueChange={(option) => {
					if (option) dispatch(setTimeSlot(option.value as TimeSlot));
				}}
			>
				<SelectTrigger className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none bg-transparent h-auto px-0 py-0 min-w-0 pl-1">
					<SelectValue
						className="text-xl text-gray-800 font-medium"
						placeholder="Select..."
					/>
				</SelectTrigger>
				<SelectContent insets={contentInsets} className="w-48 native:w-56">
					<SelectGroup>
						{slots.map((slot) => (
							<SelectItem key={slot} label={slot} value={slot}>
								<Text>{slot}</Text>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</View>
	);
}
