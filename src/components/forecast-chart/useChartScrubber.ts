import { calculateScrubberData } from "@/lib/scrubberUtils";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { PanResponder } from "react-native";
import { useChartContext } from "./ChartContext";

export function useChartScrubber() {
  const { innerWidth, margin, displayPoints, setScrubberIndex } = useChartContext();
  const pointsCount = displayPoints.length;

  const stateRef = useRef({ innerWidth, pointsCount, displayPoints, margin });
  const lastHapticIndex = useRef<number | null>(null);
  const initialTouchX = useRef<number>(0);

  useEffect(() => {
    stateRef.current = { innerWidth, pointsCount, displayPoints, margin };
  });

  const handleScrub = (x: number) => {
    const latest = stateRef.current;
    if (latest.innerWidth === 0) return;
    const contentX = x - latest.margin.left;
    const continuousIndex =
      (contentX / latest.innerWidth) * (latest.pointsCount - 1);
    
    // We calculate data locally just to get the index for haptic feedback logic.
    // However, the precise object derivation happens inside the tooltip via the index.
    const result = calculateScrubberData(
      latest.displayPoints as any,
      continuousIndex,
    );

    setScrubberIndex(result.index);
    if (lastHapticIndex.current !== result.index) {
      lastHapticIndex.current = result.index;
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const handleScrubRef = useRef(handleScrub);
  const setScrubberIndexRef = useRef(setScrubberIndex);
  
  // Keep handlers perfectly fresh across renders without re-initializing PanResponder
  useEffect(() => {
    handleScrubRef.current = handleScrub;
    setScrubberIndexRef.current = setScrubberIndex;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        initialTouchX.current = evt.nativeEvent.locationX;
        handleScrubRef.current(initialTouchX.current);
      },
      onPanResponderMove: (evt, gestureState) => {
        handleScrubRef.current(initialTouchX.current + gestureState.dx);
      },
      onPanResponderRelease: () => {
        setScrubberIndexRef.current(null);
        lastHapticIndex.current = null;
      },
      onPanResponderTerminate: () => {
        setScrubberIndexRef.current(null);
        lastHapticIndex.current = null;
      },
    }),
  ).current;

  return panResponder.panHandlers;
}
