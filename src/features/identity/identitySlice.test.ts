import { storage } from "@/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import identityReducer, {
	hydrateAuth,
	loginUser,
	logoutUser,
} from "./identitySlice";
import { getBaseApiUrl } from "@/lib/apiUtils";

const server = setupServer(
	http.post(getBaseApiUrl() + "/auth/login", async ({ request }) => {
		const { email, password } = (await request.json()) as any;
		if (password === "bad-password") {
			return HttpResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 },
			);
		}
		return HttpResponse.json({
			user: { id: "usr_1", name: "Jane Doe", email },
			token: "valid-token",
		});
	}),
	http.get(getBaseApiUrl() + "/auth/me", ({ request }) => {
		const authHeader = request.headers.get("Authorization");
		if (authHeader === "Bearer persisted-token" || authHeader === "Bearer valid-token") {
			return HttpResponse.json({
				user: { id: "usr_1", name: "Jane Doe", email: "jane@whether.io" },
			});
		}
		return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
	}),
	http.post(getBaseApiUrl() + "/auth/logout", () => {
		return HttpResponse.json({ success: true });
	}),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
	server.resetHandlers();
	storage.clear();
});
afterAll(() => server.close());

describe("Identity Feature (TDD)", () => {
	const createTestStore = () =>
		configureStore({
			reducer: { identity: identityReducer },
		});

	it("unauthenticated user cannot login with bad credentials", async () => {
		const store = createTestStore();

		await store.dispatch(
			loginUser({ email: "jane@whether.io", password: "bad-password" }),
		);

		const state = store.getState().identity;
		expect(state.isAuthenticated).toBe(false);
		expect(state.user).toBeNull();
		expect(state.status).toBe("failed");

		const storedToken = await storage.getItem("auth_token");
		expect(storedToken).toBeNull();
	});

	it("successful login persists token and updates state", async () => {
		const store = createTestStore();

		await store.dispatch(
			loginUser({ email: "jane@whether.io", password: "good-password" }),
		);

		const state = store.getState().identity;
		expect(state.isAuthenticated).toBe(true);
		expect(state.user?.email).toBe("jane@whether.io");
		expect(state.status).toBe("succeeded");

		const storedToken = await storage.getItem("auth_token");
		expect(storedToken).toBe("valid-token");
	});

	it("logout clears persisted state and resets store", async () => {
		const store = createTestStore();
		await store.dispatch(
			loginUser({ email: "jane@whether.io", password: "good-password" }),
		);

		await store.dispatch(logoutUser());

		const state = store.getState().identity;
		expect(state.isAuthenticated).toBe(false);
		expect(state.user).toBeNull();

		const storedToken = await storage.getItem("auth_token");
		expect(storedToken).toBeNull();
	});

	it("hydrates auth state from async storage if valid token exists", async () => {
		await storage.setItem("auth_token", "persisted-token");
		await storage.setItem(
			"auth_user",
			JSON.stringify({
				id: "usr_1",
				name: "Jane Doe",
				email: "jane@whether.io",
			}),
		);

		const store = createTestStore();
		await store.dispatch(hydrateAuth());

		const state = store.getState().identity;
		expect(state.isAuthenticated).toBe(true);
		expect(state.user?.name).toBe("Jane Doe");
		expect(state.status).toBe("succeeded");
	});
});
