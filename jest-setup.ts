jest.mock("@react-native-async-storage/async-storage", () => {
	let mockStorage = {};
	return {
		setItem: jest.fn((key, value) => {
			mockStorage[key] = value;
			return Promise.resolve();
		}),
		getItem: jest.fn((key) => Promise.resolve(mockStorage[key] || null)),
		removeItem: jest.fn((key) => {
			delete mockStorage[key];
			return Promise.resolve();
		}),
		clear: jest.fn(() => {
			mockStorage = {};
			return Promise.resolve();
		}),
		getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStorage))),
		multiGet: jest.fn((keys) =>
			Promise.resolve(keys.map((k) => [k, mockStorage[k]])),
		),
		multiSet: jest.fn((kvPairs) => {
			kvPairs.forEach(([k, v]) => {
				mockStorage[k] = v;
			});
			return Promise.resolve();
		}),
		multiRemove: jest.fn((keys) => {
			keys.forEach((k) => delete mockStorage[k]);
			return Promise.resolve();
		}),
	};
});

jest.mock("react-native-reanimated", () => {
	const Reanimated = jest.requireActual("react-native-reanimated/mock");
	const createMockLayoutAnimation = () => ({
		duration: jest.fn(() => createMockLayoutAnimation()),
		delay: jest.fn(() => createMockLayoutAnimation()),
		springify: jest.fn(() => createMockLayoutAnimation()),
		damping: jest.fn(() => createMockLayoutAnimation()),
		stiffness: jest.fn(() => createMockLayoutAnimation()),
		withInitialValues: jest.fn(() => createMockLayoutAnimation()),
	});
	Reanimated.FadeInUp = createMockLayoutAnimation();
	Reanimated.FadeInDown = createMockLayoutAnimation();
	Reanimated.FadeIn = createMockLayoutAnimation();
	Reanimated.FadeOut = createMockLayoutAnimation();
	Reanimated.default.call = jest.fn();
	return Reanimated;
});

jest.mock("@rn-primitives/slot", () => {
	const React = require("react");
	return {
		Slot: React.forwardRef(({ children, ...props }, ref) => {
			if (React.isValidElement(children)) {
				return React.cloneElement(children, { ...props, ref });
			}
			return children;
		}),
	};
});
