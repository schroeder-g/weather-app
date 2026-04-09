import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DayOfWeek, TimeSlot } from '../lib/dateUtils';
import { setLocation, setDayOfWeek, setTimeSlot } from '../features/event/eventSlice';
import { MapPin, Clock, Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const slots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];

export default function TopBar() {
  const dispatch = useDispatch();
  const { location, dayOfWeek, timeSlot } = useSelector((state: RootState) => state.event);
  const [locInput, setLocInput] = useState(location);
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleLocationSubmit = () => {
    dispatch(setLocation(locInput));
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
            <DropdownMenuContent className="w-48 native:w-56" insets={contentInsets}>
              <DropdownMenuItem>
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
          <MapPin color="#1f2937" size={26} />
          <TextInput
            className="flex-1 text-2xl font-bold text-gray-900 outline-none"
            value={locInput}
            onChangeText={setLocInput}
            onSubmitEditing={handleLocationSubmit}
            onBlur={handleLocationSubmit}
            placeholder="Enter location (e.g. Dolores Park, SF)"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Filters Row (Body) */}
        <View className="flex-row items-center gap-3">
          <Clock color="#1f2937" size={24} />
          
          <Select
            value={{ value: dayOfWeek.toString(), label: `Every ${fullDays[dayOfWeek]}` }}
            onValueChange={(option) => {
              if (option) dispatch(setDayOfWeek(parseInt(option.value)));
            }}
          >
            <SelectTrigger className="border-none shadow-none bg-transparent h-auto px-0 py-0 min-w-0">
              <SelectValue className="text-xl text-gray-800 font-medium" />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-48 native:w-56">
              <SelectGroup>
                {fullDays.map((day, i) => (
                  <SelectItem key={i} label={`Every ${day}`} value={i.toString()}>
                    <Text>Every {day}</Text>
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
            <SelectTrigger className="border-none shadow-none bg-transparent h-auto px-0 py-0 min-w-0 pl-1">
              <SelectValue className="text-xl text-gray-800 font-medium" />
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
    </View>
  );
}
