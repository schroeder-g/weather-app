import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { useComparisonPanelContext } from "./context";
import { Skeleton } from "@/components/ui/skeleton";

export function Summary() {
	const { summary } = useComparisonPanelContext();
	const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

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

	if (resolvedMessage === null && !isPending) {
		return (
			<View className="py-1 gap-2" testID="summary-skeleton">
				<Skeleton className="h-6 w-full" />
				<Skeleton className="h-6 w-3/4" />
			</View>
		);
	}

	return (
		<Text className="text-foreground italic leading-relaxed font-medium text-base">
			{resolvedMessage ? `"${resolvedMessage}"` : ""}
		</Text>
	);
}
