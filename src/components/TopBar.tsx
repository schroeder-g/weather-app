import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, MapPin, Menu } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setDayOfWeek,
  setLocation,
  setTimeSlot,
} from "@/features/event/eventSlice";
import { type TimeSlot } from "@/lib/dateUtils";
import type { RootState } from "@/store/store";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const slots: TimeSlot[] = ["Morning", "Afternoon", "Evening"];

export default function TopBar() {
  const dispatch = useDispatch();
  const { location, dayOfWeek, timeSlot, isLocating } = useSelector(
    (state: RootState) => state.event,
  );
  const [locInput, setLocInput] = useState(location);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLocInput(location);
  }, [location]);

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleLocationSubmit = () => {
    if (locInput !== location) {
      dispatch(setLocation(locInput));
    }
  };

  return (
    <View
      className="px-4 pb-4 bg-white border-b border-gray-200"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <View className="flex-col gap-6">
        {/* Header Row */}
        <View className="flex-row items-center justify-between">
          <Text className="text-red-500 font-black text-xl tracking-widest uppercase">
            Whether.io
          </Text>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu color="#1f2937" size={32} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48 native:w-56"
              insets={contentInsets}
            >
              <DropdownMenuItem onPress={() => setIsHelpOpen(true)}>
                <Text>Help</Text>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <Text className="text-red-500">Log out</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </View>

        {/* Location Row (Subheading) */}
        <View className="flex-row items-center gap-3 pr-4">
          {isLocating ? (
            <ActivityIndicator color="#1f2937" size="small" />
          ) : (
            <MapPin color="#1f2937" size={26} />
          )}
          <TextInput
            className="flex-1 text-2xl font-bold text-gray-900 outline-none"
            value={locInput}
            onChangeText={setLocInput}
            onSubmitEditing={handleLocationSubmit}
            onBlur={handleLocationSubmit}
            placeholder="Choose location"
            placeholderTextColor="#9ca3af"
            editable={!isLocating}
          />
        </View>

        {/* Filters Row (Body) */}
        <View className="flex-row items-center gap-3">
          <Clock color="#1f2937" size={24} />

          <Select
            value={{
              value: dayOfWeek.toString(),
              label: `Every ${fullDays[dayOfWeek]}`,
            }}
            onValueChange={(option) => {
              if (option) dispatch(setDayOfWeek(parseInt(option.value)));
            }}
          >
            <SelectTrigger className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none bg-transparent h-auto px-0 py-0 min-w-0">
              <SelectValue
                className="text-xl text-gray-800 font-medium"
                placeholder="Select..."
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-48 native:w-56">
              <SelectGroup>
                {fullDays.map((day, i) => (
                  <SelectItem
                    key={i}
                    label={day}
                    value={i.toString()}
                  >
                    <Text>{day}</Text>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={{ value: timeSlot, label: timeSlot }}
            onValueChange={(option) => {
              if (option) dispatch(setTimeSlot(option.value as TimeSlot));
            }}
          >
            <SelectTrigger className="border-0 border-transparent shadow-none outline-none focus:outline-none focus:ring-0 active:outline-none bg-transparent h-auto px-0 py-0 min-w-0 pl-1">
              <SelectValue
                className="text-xl text-gray-800 font-medium"
                placeholder="Select..."
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-48 native:w-56">
              <SelectGroup>
                {slots.map((slot) => (
                  <SelectItem key={slot} label={slot} value={slot}>
                    <Text>{slot}</Text>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="gap-3">
            <DialogTitle>About Whether.io</DialogTitle>
            <DialogDescription>
              Whether.io is designed for outdoor event organizers to find the
              most optimal weather window for their meetups up to two weeks in
              advance.
            </DialogDescription>
          </DialogHeader>

          <View className="mt-4">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="location-hanging">
                <AccordionTrigger>
                  <Text>Location selector loads endlessly?</Text>
                </AccordionTrigger>
                <AccordionContent>
                  <Text className="text-gray-600">
                    If the location spinner hangs indefinitely, check your
                    device's System Privacy settings. Ensure that your browser
                    (e.g., Chrome, Safari) has correct OS-level permission to
                    access Location Services.
                  </Text>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}
