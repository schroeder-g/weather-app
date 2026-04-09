import { Clock } from "lucide-react-native";
import React, { useState } from "react";
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
	const [isDayPressed, setIsDayPressed] = useState(false);
	const [isTimePressed, setIsTimePressed] = useState(false);
	const [isDayOpen, setIsDayOpen] = useState(false);
	const [isTimeOpen, setIsTimeOpen] = useState(false);

	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};

	return (
		<View className="flex-row items-center gap-3">
			<Clock className="text-foreground" size={24} />

			<Select
				onOpenChange={setIsDayOpen}
				value={{
					value: dayOfWeek.toString(),
					label: `Every ${fullDays[dayOfWeek]}`,
				}}
				onValueChange={(option) => {
					if (option) dispatch(setDayOfWeek(parseInt(option.value)));
				}}
			>
				<SelectTrigger
					className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 hover:bg-black/5 hover:scale-105 active:scale-[0.97] active:opacity-90 transition-all rounded-md bg-transparent h-auto px-2 py-1 min-w-0 gap-3 relative"
					onPressIn={() => setIsDayPressed(true)}
					onPressOut={() => setIsDayPressed(false)}
				>
					<SelectValue
						className={`text-lg transition-colors duration-200 font-medium ${isDayPressed || isDayOpen ? "text-primary" : "text-foreground"}`}
						placeholder="Select..."
					/>
				</SelectTrigger>
				<SelectContent
					sideOffset={8}
					insets={contentInsets}
					className="w-48 native:w-56"
				>
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
				onOpenChange={setIsTimeOpen}
				value={{ value: timeSlot, label: timeSlot }}
				onValueChange={(option) => {
					if (option) dispatch(setTimeSlot(option.value as TimeSlot));
				}}
			>
				<SelectTrigger
					className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 hover:bg-black/5 hover:scale-105 active:scale-[0.97] active:opacity-90 transition-all rounded-md bg-transparent h-auto px-2 py-1 min-w-0 pl-1 gap-3 relative"
					onPressIn={() => setIsTimePressed(true)}
					onPressOut={() => setIsTimePressed(false)}
				>
					<SelectValue
						className={`text-lg transition-colors duration-200 font-medium ${isTimePressed || isTimeOpen ? "text-primary" : "text-foreground"}`}
						placeholder="Select..."
					/>
				</SelectTrigger>
				<SelectContent
					sideOffset={8}
					insets={contentInsets}
					className="w-48 native:w-56"
				>
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
