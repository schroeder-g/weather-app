import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { HttpResponse, http } from "msw";
import React from "react";
import { Provider } from "react-redux";
import LoginScreen from "@/app/login";
import { storage } from "@/lib/storage";
import { server } from "@/mocks/server";
import identityReducer from "./identitySlice";

// Mock expo-router
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
	useRouter: () => ({
		replace: mockReplace,
	}),
	useSegments: () => ["login"],
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock");
	Reanimated.default.call = () => {};
	return {
		...Reanimated,
		FadeInUp: {
			springify: () => ({
				damping: () => ({ delay: () => ({}) }),
			}),
		},
	};
});

beforeAll(() => server.listen());
afterEach(() => {
	server.resetHandlers();
	storage.clear();
	mockReplace.mockClear();
});
afterAll(() => server.close());

describe("Auth Integration Test Suite", () => {
	const createTestStore = () =>
		configureStore({
			reducer: { identity: identityReducer },
		});

	it("renders login screen and displays error on invalid login", async () => {
		// Override handler to return 401
		server.use(
			http.post("https://api.whether.io/auth/login", () => {
				return HttpResponse.json(
					{ message: "Invalid credentials" },
					{ status: 401 },
				);
			}),
		);

		const store = createTestStore();
		const { getByText } = render(
			<Provider store={store}>
				<LoginScreen />
			</Provider>,
		);

		fireEvent.press(getByText("Log in"));

		await waitFor(() => {
			expect(getByText("Invalid credentials")).toBeTruthy();
		});

		// Verify store state
		expect(store.getState().identity.isAuthenticated).toBe(false);
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it.skip("successfully logs in and navigates securely", async () => {
		const store = createTestStore();
		const { getByText } = render(
			<Provider store={store}>
				<LoginScreen />
			</Provider>,
		);

		fireEvent.press(getByText("Log in"));

		await waitFor(() => {
			expect(store.getState().identity.isAuthenticated).toBe(true);
		});

		// Verify router replacement logic triggered
		expect(mockReplace).toHaveBeenCalledWith("/");

		// Check async storage layer integrated correctly
		const token = await storage.getItem("auth_token");
		expect(token).toBe("fake-jwt-token-123");
	});
});
