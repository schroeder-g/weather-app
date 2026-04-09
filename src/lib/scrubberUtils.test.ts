import { calculateScrubberData, type ScrubberResult } from "./scrubberUtils";

const mockPoints = [
	{ time: "06:00", temp: 50, precip: 0, wind: 5 },
	{ time: "07:00", temp: 52, precip: 10, wind: 6 },
	{ time: "08:00", temp: 56, precip: 5, wind: 7 },
];

describe("scrubberUtils", () => {
    describe("calculateScrubberData", () => {
        it("returns exact point values for whole hour indices", () => {
			const result = calculateScrubberData(mockPoints, 1);
            expect(result.time).toBe("07:00");
			expect(result.temp).toBe(52);
			expect(result.precip).toBe(10);
		});

        it("snaps continuous index to nearest 5-minute interval (1/12th)", () => {
			// index 0.1 is 1/10th. 5-min intervals are at 0, 0.0833, 0.166... 
			// 0.1 is closer to 0.0833 (which is 06:05)
			const result = calculateScrubberData(mockPoints, 0.1);
            expect(result.time).toBe("06:05");
			// temp: 50 -> 52. Diff is 2. At 5 mins (1/12th hour), temp increases by 2 * (1/12) = 0.1666 -> 50.17
			expect(result.temp).toBeCloseTo(50.166, 2);
		});

        it("interpolates exactly at the half hour (index 0.5)", () => {
            const result = calculateScrubberData(mockPoints, 0.5);
            expect(result.time).toBe("06:30");
            expect(result.temp).toBe(51); // (50 + 52) / 2
            expect(result.precip).toBe(5); // (0 + 10) / 2
        });

        it("clamps underflows to the first point", () => {
            const result = calculateScrubberData(mockPoints, -0.5);
            expect(result.time).toBe("06:00");
            expect(result.temp).toBe(50);
        });

        it("clamps overflows to the last point", () => {
            const result = calculateScrubberData(mockPoints, 5.5);
            expect(result.time).toBe("08:00");
            expect(result.temp).toBe(56);
        });
    });
});
