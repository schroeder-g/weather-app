import React from "react";
import { Text, TextProps } from "react-native";

export function getOrdinalSuffix(day: number): string {
	if (day > 3 && day < 21) return "th";
	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}

export function formatTimeWindow(startHour: number, endHour: number): string {
	const formatHour = (h: number) => {
		if (h === 0) return "12 am";
		if (h === 12) return "12 pm";
		if (h > 12) return `${h - 12} pm`;
		return `${h} am`;
	};

	const startAmPm = startHour >= 12 ? "pm" : "am";
	const endAmPm = endHour >= 12 ? "pm" : "am";

	if (startAmPm === endAmPm) {
		const start = startHour === 0 ? 12 : startHour > 12 ? startHour - 12 : startHour;
		const end = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
		return `${start}-${end} ${endAmPm}`;
	}

	return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export interface FormattedDateProps extends TextProps {
	date: Date;
	/**
	 * Formats configuration for Intl.DateTimeFormat (defaults to weekday, month, and day)
	 */
	dateFormatOptions?: Intl.DateTimeFormatOptions;
	/**
	 * An optional chunk of text appended to the final string (e.g. ", 5-9 pm").
	 * Rendered inside the same text line so it correctly flows.
	 */
	appendString?: string;
	/**
	 * Add specific class styles to the superscript suffix text.
	 */
	ordinalClassName?: string;
}

export function FormattedDate({
	date,
	dateFormatOptions,
	appendString,
	className,
	ordinalClassName = "text-[10px] leading-3",
	...props
}: FormattedDateProps) {
	const options = dateFormatOptions || {
		weekday: "long",
		month: "long",
		day: "numeric",
	};

	const formatter = new Intl.DateTimeFormat("en-US", options);
	const parts = formatter.formatToParts(date);

	return (
		<Text className={className} {...props}>
			{parts.map((part, index) => {
				if (part.type === "day") {
					return (
						<React.Fragment key={index}>
							{part.value}
							<Text
								className={ordinalClassName}
								style={{ textAlignVertical: "top" }}
							>
								{getOrdinalSuffix(parseInt(part.value, 10))}
							</Text>
						</React.Fragment>
					);
				}
				return <React.Fragment key={index}>{part.value}</React.Fragment>;
			})}
			{appendString && <React.Fragment>{appendString}</React.Fragment>}
		</Text>
	);
}
