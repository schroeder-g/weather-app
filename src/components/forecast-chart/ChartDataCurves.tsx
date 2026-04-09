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
import { useChartContext } from "./ChartContext";
import { useWeatherComparisonContext } from "@/features/weather/WeatherComparisonProvider";
import { CURVE_DEFINITIONS } from "./config";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ChartDataCurves = memo(() => {
	const { displayPoints, xScale, yScale, innerHeight } = useChartContext();
	const { state } = useWeatherComparisonContext();
	const { activeCurves } = state;

	const curvePaths = useMemo(() => {
		return (activeCurves || []).map((curveType) => {
			const config = CURVE_DEFINITIONS[curveType];
			const lineGen = d3
				.line<any>()
				.x((d, i) => xScale(i))
				.y((d) => yScale(config.getValue(d)))
				.curve(d3.curveMonotoneX);

			return {
				type: curveType,
				path: lineGen(displayPoints) as string | null,
				config,
			};
		}).filter((c) => c.path !== null);
	}, [displayPoints, xScale, yScale, activeCurves]);

	const progress = useSharedValue(0);

	useEffect(() => {
		if (curvePaths.length === 0) return;

		cancelAnimation(progress);

		progress.value = withSequence(
			withTiming(0, { duration: 0 }),
			withTiming(1, {
				duration: 600,
				easing: Easing.out(Easing.cubic),
			}),
		);
	}, [curvePaths, progress]); // Including curvePaths will re-trigger animation on toggles, which looks cool!

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
				{(activeCurves || []).map((curveType) => {
					const config = CURVE_DEFINITIONS[curveType];
					return (
						<LinearGradient
							key={`grad-${curveType}`}
							id={`${curveType}Gradient`}
							x1="0"
							y1="0"
							x2="0"
							y2={innerHeight}
							gradientUnits="userSpaceOnUse"
						>
							<Stop offset="0" stopColor={config.color} />
							<Stop offset="1" stopColor={config.color} stopOpacity={0.2} />
						</LinearGradient>
					);
				})}
			</Defs>
			{curvePaths.map(({ type, path }) => (
				<AnimatedPath
					key={`path-${type}`}
					d={path!}
					animatedProps={animatedProps}
					fill="none"
					stroke={`url(#${type}Gradient)`}
					strokeWidth={3}
					vectorEffect="non-scaling-stroke"
				/>
			))}
		</G>
	);
});

ChartDataCurves.displayName = "ChartDataCurves";

export default ChartDataCurves;
