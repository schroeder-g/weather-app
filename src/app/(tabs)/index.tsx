import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import ComparisonPanel from "@/components/comparison-panel";
import ForecastChart from "@/components/ForecastChart";
import TopBar from "@/components/TopBar";
import ChartConfigPopover from "@/components/forecast-chart/ChartConfigPopover";
import ChartInfoPopover from "@/components/forecast-chart/ChartInfoPopover";
import { FormattedDate } from "@/components/ui/FormattedDate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text as UIText } from "@/components/ui/text";
import {
  useWeatherComparisonContext,
  WeatherComparisonProvider,
} from "@/features/weather/WeatherComparisonProvider";

function WeatherLayout() {
  const { state, actions } = useWeatherComparisonContext();
  const {
    isFetching,
    error,
    location,
    thisWeekResult,
    nextWeekResult,
    thisWeekDate,
    nextWeekDate,
    selectedWeek,
    isReady,
  } = state;

  return (
    <View className="flex-1 bg-white">
      <TopBar />

      <ScrollView
        className="flex-1 px-4 py-6"
        contentContainerStyle={{
          paddingBottom: 80,
          maxWidth: 1200,
          alignSelf: "center",
          width: "100%",
        }}
      >
        {isFetching && (
          <View className="p-8 items-center justify-center">
            <ActivityIndicator className="text-primary" size="large" />
            <Text className="mt-4 text-muted-foreground">
              Fetching latest forecast for {location}...
            </Text>
          </View>
        )}

        {/** Error State **/}
        {error && !isFetching && (
          <View className="bg-destructive/10 p-4 rounded-lg my-4 border border-destructive/20 items-center">
            <Text className="text-destructive font-semibold">
              Could not load weather data.
            </Text>
            <Text className="text-destructive/80 text-sm mt-1">
              Please ensure your location is valid and try again.
            </Text>
          </View>
        )}

        {/** Empty State **/}
        {!isFetching && !error && (!thisWeekResult || !nextWeekResult) && (
          <View className="p-8 items-center justify-center border-dashed border-2 border-border rounded-xl my-8">
            <Text className="text-muted-foreground">
              Pick a valid location and date within the next 15 days.
            </Text>
          </View>
        )}

        {/** Results View **/}
        {isReady &&
          thisWeekResult &&
          nextWeekResult &&
          thisWeekDate &&
          nextWeekDate && (
            <Animated.View
              entering={FadeIn.duration(400)}
              exiting={FadeOut}
              layout={LinearTransition.springify()}
            >
              <Animated.View
                layout={LinearTransition.springify()}
                className="my-1"
              >
                <ComparisonPanel.Root
                  summary={
                    selectedWeek === "this" ? thisWeekResult : nextWeekResult
                  }
                >
                  <ComparisonPanel.Header
                    title={selectedWeek === "this" ? "This Week" : "Next Week"}
                    date={selectedWeek === "this" ? thisWeekDate : nextWeekDate}
                  />
                  <ComparisonPanel.Metrics />
                  <ComparisonPanel.Recommendation />
                  <ComparisonPanel.Summary />
                </ComparisonPanel.Root>
              </Animated.View>

              <View className="my-1 z-50 flex-row justify-start items-center w-full relative">
                <Tabs
                  value={selectedWeek}
                  onValueChange={(val) =>
                    actions.setSelectedWeek(val as "this" | "next")
                  }
                >
                  <TabsList className="flex-row">
                    <TabsTrigger value="this">
                      <UIText>This week</UIText>
                    </TabsTrigger>
                    <TabsTrigger value="next">
                      <UIText>Next week</UIText>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <View className="flex-row items-center ml-3">
                  <ChartConfigPopover />
                </View>
              </View>

              <ForecastChart
                data={selectedWeek === "this" ? thisWeekResult : nextWeekResult}
              />

              <View className="flex-row items-center justify-center gap-2 mt-4 mb-8 z-50">
                <Text className="text-2xl font-bold text-foreground">
                  {selectedWeek === "this" ? "This " : "Next "}
                  <FormattedDate
                    date={selectedWeek === "this" ? thisWeekDate : nextWeekDate}
                    ordinalClassName="text-[14px] leading-5"
                  />
                </Text>
              </View>
            </Animated.View>
          )}
      </ScrollView>
    </View>
  );
}

export default function TabOneScreen() {
  return (
    <WeatherComparisonProvider>
      <WeatherLayout />
    </WeatherComparisonProvider>
  );
}
