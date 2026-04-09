import React from "react";
import { Text, View } from "react-native";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface HelpDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader className="gap-3">
					<DialogTitle>About Whether.io</DialogTitle>
					<DialogDescription>
						Whether.io is designed for outdoor event organizers to find the most
						optimal weather window for their meetups up to two weeks in advance.
					</DialogDescription>
				</DialogHeader>

				<View className="mt-4">
					<Accordion type="multiple" className="w-full">
						<AccordionItem value="location-hanging">
							<AccordionTrigger>
								<Text>Location selector loads endlessly?</Text>
							</AccordionTrigger>
							<AccordionContent>
								<Text className="text-muted-foreground">
									If the location spinner hangs indefinitely, check your
									device's System Privacy settings. Ensure that your browser
									(e.g., Chrome, Safari) has correct OS-level permission to
									access Location Services.
								</Text>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</View>
			</DialogContent>
		</Dialog>
	);
}
