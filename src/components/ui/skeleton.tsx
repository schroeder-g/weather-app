import * as React from "react";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

function Skeleton({
	className,
	...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "style"> & {
	style?: any;
}) {
	const sv = useSharedValue(1);

	React.useEffect(() => {
		sv.value = withRepeat(
			withSequence(
				withTiming(0.5, { duration: 1000 }),
				withTiming(1, { duration: 1000 }),
			),
			-1,
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		opacity: sv.value,
	}));

	return (
		<Animated.View
			style={[style, props.style]}
			className={cn("bg-muted rounded-md", className)}
			{...props}
		/>
	);
}

export { Skeleton };
