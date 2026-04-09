import * as d3 from "d3";
import React, { memo, useEffect, useMemo } from "react";
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedProps,
	useSharedValue,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { palette } from "@/themes/config";
import { useChartContext } from "./ChartContext";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ChartDataCurves = memo(() => {
	const { displayPoints, xScale, yScale, innerHeight } = useChartContext();

	const { tempPath, precipPath } = useMemo(() => {
		const tempLineGen = d3
			.line<any>()
			.x((d, i) => xScale(i))
			.y((d) => yScale(d.temp))
			.curve(d3.curveMonotoneX);

		const precipLineGen = d3
			.line<any>()
			.x((d, i) => xScale(i))
			.y((d) => yScale(d.precip))
			.curve(d3.curveMonotoneX);

		return {
			tempPath: tempLineGen(displayPoints) as string | null,
			precipPath: precipLineGen(displayPoints) as string | null,
		};
	}, [displayPoints, xScale, yScale]);

	const progress = useSharedValue(0);

	useEffect(() => {
		if (!tempPath || !precipPath) return;

		cancelAnimation(progress);

		// Explicit sequence ensures Reanimated commits the 0 start point to the UI thread
		// before computing the transition up to 1, preventing the animation from being skipped.
		progress.value = withSequence(
			withTiming(0, { duration: 0 }),
			withTiming(1, {
				duration: 600,
				easing: Easing.out(Easing.cubic),
			}),
		);
	}, [tempPath, precipPath, progress]);

	const animatedProps = useAnimatedProps(() => {
		return {
			transform: [
				{ translateY: innerHeight },
				{ scaleY: progress.value },
				{ translateY: -innerHeight },
			],
		} as any;
	});

	return (
		<G>
			<Defs>
				<LinearGradient
					id="tempGradient"
					x1="0"
					y1="0"
					x2="0"
					y2={innerHeight}
					gradientUnits="userSpaceOnUse"
				>
					<Stop offset="0" stopColor={palette.orange[500]} />
					<Stop offset="1" stopColor={palette.orange[500]} stopOpacity={0.2} />
				</LinearGradient>
				<LinearGradient
					id="precipGradient"
					x1="0"
					y1="0"
					x2="0"
					y2={innerHeight}
					gradientUnits="userSpaceOnUse"
				>
					<Stop offset="0" stopColor={palette.blue[500]} />
					<Stop offset="1" stopColor={palette.blue[500]} stopOpacity={0.2} />
				</LinearGradient>
			</Defs>
			{tempPath && (
				<AnimatedPath
					d={tempPath}
					animatedProps={animatedProps}
					fill="none"
					stroke="url(#tempGradient)"
					strokeWidth={3}
					vectorEffect="non-scaling-stroke"
				/>
			)}
			{precipPath && (
				<AnimatedPath
					d={precipPath}
					animatedProps={animatedProps}
					fill="none"
					stroke="url(#precipGradient)"
					strokeWidth={3}
					vectorEffect="non-scaling-stroke"
				/>
			)}
		</G>
	);
});

ChartDataCurves.displayName = "ChartDataCurves";

export default ChartDataCurves;
