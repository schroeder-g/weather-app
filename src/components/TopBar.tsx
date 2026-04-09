import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { DayOfWeek, TimeSlot } from '../lib/dateUtils';
import { setLocation, setDayOfWeek, setTimeSlot } from '../features/event/eventSlice';
import { MapPin, Clock, Calendar } from 'lucide-react-native';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const slots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];

export default function TopBar() {
  const dispatch = useDispatch();
  const { location, dayOfWeek, timeSlot } = useSelector((state: RootState) => state.event);
  const [locInput, setLocInput] = useState(location);

  const handleLocationSubmit = () => {
    dispatch(setLocation(locInput));
  };

  return (
    <View className="p-4 bg-white border-b border-gray-200">
      <View className="flex-row flex-wrap items-center justify-between gap-4">
        
        {/* Location Input */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 min-w-[250px]">
          <MapPin color="gray" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800 outline-none"
            value={locInput}
            onChangeText={setLocInput}
            onSubmitEditing={handleLocationSubmit}
            onBlur={handleLocationSubmit}
            placeholder="Enter location (e.g. Dolores Park, SF)"
          />
        </View>

        {/* Day Picker */}
        <View className="flex-row items-center gap-2">
          <Calendar color="gray" size={20} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {days.map((day, i) => (
              <Pressable
                key={day}
                onPress={() => dispatch(setDayOfWeek(i))}
                className={`px-3 py-1 mx-1 rounded-full border ${
                  dayOfWeek === i ? 'bg-black border-black' : 'bg-transparent border-gray-300'
                }`}
              >
                <Text className={`${dayOfWeek === i ? 'text-white' : 'text-gray-600'}`}>{day}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time Slot Picker */}
        <View className="flex-row items-center gap-2">
          <Clock color="gray" size={20} />
          <View className="flex-row">
            {slots.map((slot) => (
              <Pressable
                key={slot}
                onPress={() => dispatch(setTimeSlot(slot))}
                className={`px-3 py-1 mx-1 rounded-full border ${
                  timeSlot === slot ? 'bg-black border-black' : 'bg-transparent border-gray-300'
                }`}
              >
                <Text className={`${timeSlot === slot ? 'text-white' : 'text-gray-600'}`}>{slot}</Text>
              </Pressable>
            ))}
          </View>
        </View>

      </View>
    </View>
  );
}
