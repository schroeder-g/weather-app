import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, LayoutChangeEvent } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';

interface SlideToConfirmProps {
  onConfirm: () => void;
  title?: string;
  width?: number;
  height?: number;
}

export function SlideToConfirm({
  onConfirm,
  title = 'Slide to log out',
  width = 280,
  height = 56,
}: SlideToConfirmProps) {
  const [containerWidth, setContainerWidth] = useState(width);
  const BUTTON_SIZE = height - 8;
  const END_POSITION = containerWidth - BUTTON_SIZE - 8;
  const CONFIRM_THRESHOLD = END_POSITION * 0.8;

  const translateX = useSharedValue(0);
  const isConfirmed = useSharedValue(false);

  const setConfirmed = () => {
    onConfirm();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (isConfirmed.value) return;

      let newValue = event.translationX;
      if (newValue < 0) newValue = 0;
      if (newValue > END_POSITION) newValue = END_POSITION;

      translateX.value = newValue;
    })
    .onEnd(() => {
      if (isConfirmed.value) return;

      if (translateX.value > CONFIRM_THRESHOLD) {
        translateX.value = withSpring(END_POSITION, { overshootClamping: true });
        isConfirmed.value = true;
        runOnJS(setConfirmed)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [0, END_POSITION],
      ['rgba(255, 59, 48, 0.1)', 'rgba(255, 59, 48, 0.4)']
    ) as string;

    return { backgroundColor };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - translateX.value / CONFIRM_THRESHOLD,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, borderRadius: height / 2 },
        animatedContainerStyle,
      ]}
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        {title}
      </Animated.Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          testID="slide-to-confirm-button"
          style={[
            styles.button,
            {
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              borderRadius: BUTTON_SIZE / 2,
            },
            animatedButtonStyle,
          ]}
        >
          <Text style={styles.buttonText}>{'>'}</Text>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    overflow: 'hidden',
  },
  text: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
  },
  button: {
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
});
