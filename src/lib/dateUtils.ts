import { addDays, isSameDay, nextDay, set, startOfDay } from "date-fns";

export enum DayOfWeek {
	Sunday = 0,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}

export type TimeSlot = "Morning" | "Afternoon" | "Evening";

export function getUpcomingDates(dayOfWeek: DayOfWeek): [Date, Date] {
	const now = new Date();
	const startOfNow = startOfDay(now);

	// If target day is today, thisWeek is today. Otherwise, find the next occurrence.
	const thisWeek =
		now.getDay() === dayOfWeek
			? startOfNow
			: startOfDay(nextDay(now, dayOfWeek));
	const nextWeek = addDays(thisWeek, 7);

	return [thisWeek, nextWeek];
}

export function getSlotBounds(date: Date, slot: TimeSlot): [Date, Date] {
	let startHour = 8;
	let endHour = 12;

	if (slot === "Afternoon") {
		startHour = 12;
		endHour = 17;
	} else if (slot === "Evening") {
		startHour = 17;
		endHour = 21;
	}

	const start = set(date, {
		hours: startHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});
	const end = set(date, {
		hours: endHour,
		minutes: 0,
		seconds: 0,
		milliseconds: 0,
	});

	return [start, end];
}
