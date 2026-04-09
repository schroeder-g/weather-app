import { act, renderHook } from "@testing-library/react-native";
import { useDebounce } from "../useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
	it("should return initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("initial", 500));
		expect(result.current).toBe("initial");
	});

	it("should debounce value updates", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 500 } },
		);

		expect(result.current).toBe("initial");

		// Update value
		rerender({ value: "updated", delay: 500 });

		// Value shouldn't change immediately
		expect(result.current).toBe("initial");

		// Advance timers partly
		act(() => {
			jest.advanceTimersByTime(250);
		});
		expect(result.current).toBe("initial");

		// Advance past delay
		act(() => {
			jest.advanceTimersByTime(250);
		});
		expect(result.current).toBe("updated");
	});

	it("should cancel previous timeout if value changes quickly", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: "initial", delay: 500 } },
		);

		rerender({ value: "update1", delay: 500 });
		act(() => {
			jest.advanceTimersByTime(250);
		});

		rerender({ value: "update2", delay: 500 });
		act(() => {
			jest.advanceTimersByTime(300);
		});

		expect(result.current).toBe("initial");

		act(() => {
			jest.advanceTimersByTime(200);
		});
		expect(result.current).toBe("update2");
	});
});
