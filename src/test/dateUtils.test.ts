import { getUpcomingDates, TimeSlot, DayOfWeek, getSlotBounds } from '@/lib/dateUtils';

describe('dateUtils', () => {
  describe('getUpcomingDates', () => {
    beforeAll(() => {
      // Mock system time to a fixed date: 2026-04-08 (Wednesday)
      jest.useFakeTimers().setSystemTime(new Date('2026-04-08T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('returns the coming Friday and next Friday', () => {
      const [thisWeek, nextWeek] = getUpcomingDates(DayOfWeek.Friday);
      expect(thisWeek.toISOString().startsWith('2026-04-10')).toBe(true);
      expect(nextWeek.toISOString().startsWith('2026-04-17')).toBe(true);
    });

    it('returns today and next week if the target day is today', () => {
      const [thisWeek, nextWeek] = getUpcomingDates(DayOfWeek.Wednesday);
      expect(thisWeek.toISOString().startsWith('2026-04-08')).toBe(true);
      expect(nextWeek.toISOString().startsWith('2026-04-15')).toBe(true);
    });

    it('returns the next occurrence if target day was earlier in the week', () => {
      const [thisWeek, nextWeek] = getUpcomingDates(DayOfWeek.Monday);
      expect(thisWeek.toISOString().startsWith('2026-04-13')).toBe(true);
      expect(nextWeek.toISOString().startsWith('2026-04-20')).toBe(true);
    });
  });

  describe('getSlotBounds', () => {
    it('returns 08:00 to 12:00 for Morning', () => {
      const baseDate = new Date('2026-04-08T00:00:00Z');
      const [start, end] = getSlotBounds(baseDate, 'Morning');
      expect(start.getHours()).toBe(8);
      expect(end.getHours()).toBe(12);
      expect(start.getMinutes()).toBe(0);
      expect(end.getMinutes()).toBe(0);
    });
  });
});
