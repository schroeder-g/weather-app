import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Text, View } from 'react-native';
import { WeatherComparisonProvider, useWeatherComparisonContext } from './WeatherComparisonProvider';

// Mock the API slice correctly since it's used inside the provider
import { api } from '@/store/api';
import eventReducer from '@/features/event/eventSlice';

const createTestStore = () => configureStore({
  reducer: {
    event: eventReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const ConsumerComponent = () => {
  const { state, actions } = useWeatherComparisonContext();
  return (
    <View>
      <Text testID="activeCurves">{state.activeCurves?.join(',')}</Text>
      <Text testID="toggleTemp" onPress={() => actions.toggleCurve('temp')}>Toggle Temp</Text>
      <Text testID="toggleWind" onPress={() => actions.toggleCurve('wind')}>Toggle Wind</Text>
    </View>
  );
};

describe('WeatherComparisonProvider', () => {
  it('initializes with temp and precip curves active', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <WeatherComparisonProvider>
          <ConsumerComponent />
        </WeatherComparisonProvider>
      </Provider>
    );

    expect(getByTestId('activeCurves').props.children).toBe('temp,precip');
  });

  it('toggles curves idempotently', () => {
    const store = createTestStore();
    const { getByTestId } = render(
      <Provider store={store}>
        <WeatherComparisonProvider>
          <ConsumerComponent />
        </WeatherComparisonProvider>
      </Provider>
    );

    // Initial state
    expect(getByTestId('activeCurves').props.children).toBe('temp,precip');

    // Remove temp
    act(() => {
      getByTestId('toggleTemp').props.onPress();
    });
    expect(getByTestId('activeCurves').props.children).toBe('precip');

    // Add wind
    act(() => {
      getByTestId('toggleWind').props.onPress();
    });
    expect(getByTestId('activeCurves').props.children).toBe('precip,wind');

    // Re-add temp
    act(() => {
      getByTestId('toggleTemp').props.onPress();
    });
    expect(getByTestId('activeCurves').props.children).toContain('temp');
    expect(getByTestId('activeCurves').props.children).toContain('precip');
    expect(getByTestId('activeCurves').props.children).toContain('wind');
  });
});
