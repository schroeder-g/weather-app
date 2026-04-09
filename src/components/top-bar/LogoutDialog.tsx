import React from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { logoutUser } from "@/features/identity/identitySlice";
import type { AppDispatch } from "@/store/store";
import { SlideToConfirm } from "../ui/slide-to-confirm";

interface LogoutDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
	const dispatch = useDispatch<AppDispatch>();

	const handleLogout = async () => {
		await dispatch(logoutUser());
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Sign Out</DialogTitle>
					<DialogDescription>
						Are you sure you want to log out of Whether.io? You will need to
						sign in again to access your preferences.
					</DialogDescription>
				</DialogHeader>

				<View className="py-8 items-center justify-center">
					<SlideToConfirm onConfirm={handleLogout} title="Slide to sign out" />
				</View>
			</DialogContent>
		</Dialog>
	);
}
