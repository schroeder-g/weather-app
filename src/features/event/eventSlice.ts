import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DayOfWeek, TimeSlot } from '../../lib/dateUtils';

interface EventState {
  location: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
}

const initialState: EventState = {
  location: 'Dolores Park, SF',
  dayOfWeek: new Date().getDay(),
  timeSlot: 'Afternoon',
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setDayOfWeek: (state, action: PayloadAction<DayOfWeek>) => {
      state.dayOfWeek = action.payload;
    },
    setTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      state.timeSlot = action.payload;
    },
  },
});

export const { setLocation, setDayOfWeek, setTimeSlot } = eventSlice.actions;
export default eventSlice.reducer;
