import React, { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { useComparisonPanelContext } from "./context";
import { Skeleton } from "@/components/ui/skeleton";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Copy, Check } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export function Summary() {
	const { summary } = useComparisonPanelContext();
	const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);
	const [hasCopied, setHasCopied] = useState(false);

	const messageCache = React.useRef(new Map<typeof summary, string>());
	const [isPending, startTransition] = React.useTransition();

	useEffect(() => {
		let isCancelled = false;

		const consumeStream = async () => {
			const cached = messageCache.current.get(summary);
			if (cached) {
				setResolvedMessage(cached);
				return;
			}

			setResolvedMessage(null);
			let fullMessage = "";

			try {
				if (typeof summary.message === "string") {
					setResolvedMessage(summary.message);
				} else if (summary.message instanceof Promise) {
					const msg = await summary.message;
					if (!isCancelled) setResolvedMessage(msg);
				} else if (summary.message && typeof summary.message[Symbol.asyncIterator] === 'function') {
					for await (const chunk of summary.message) {
						if (isCancelled) break;
						fullMessage += chunk;
						startTransition(() => {
							setResolvedMessage(fullMessage);
						});
						messageCache.current.set(summary, fullMessage);
					}
				}
			} catch (err) {
				console.warn("Message read error:", err);
				if (!isCancelled) setResolvedMessage("Failed to load message.");
			}
		};

		consumeStream();

		return () => {
			isCancelled = true;
		};
	}, [summary]);

	const copyToClipboard = async () => {
		if (!resolvedMessage) return;
		await Clipboard.setStringAsync(resolvedMessage);
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
		setHasCopied(true);
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	};

	if (resolvedMessage === null && !isPending) {
		return (
			<View className="py-1 gap-2" testID="summary-skeleton">
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-3/4" />
			</View>
		);
	}

	return (
		<Pressable onPress={copyToClipboard}>
			{({ pressed }) => (
				<View className={`flex-row items-start gap-2 transition-opacity duration-200 ${pressed ? "opacity-70" : "opacity-100"}`}>
					<Text className="text-foreground italic leading-relaxed font-medium text-base flex-1">
						{resolvedMessage ? `"${resolvedMessage}"` : ""}
					</Text>
					{resolvedMessage ? (
						<View className="mt-1 opacity-60">
							{hasCopied ? (
								<Icon as={Check} size={16} className="text-green-500 dark:text-green-400" />
							) : (
								<Icon as={Copy} size={16} className="text-foreground" />
							)}
						</View>
					) : null}
				</View>
			)}
		</Pressable>
	);
}
