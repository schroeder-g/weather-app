import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { storage } from "@/lib/storage";
import { getBaseApiUrl } from "@/lib/apiUtils";

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface IdentityState {
	isAuthenticated: boolean;
	user: User | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: IdentityState = {
	isAuthenticated: false,
	user: null,
	status: "idle",
	error: null,
};

export const loginUser = createAsyncThunk(
	"identity/login",
	async (credentials: any, { rejectWithValue }) => {
		try {
			const response = await fetch(getBaseApiUrl() + "/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				throw new Error("Invalid credentials");
			}

			const data = await response.json();
			if (data.token) {
				await storage.setItem("auth_token", data.token);
			}
			if (data.user) {
				await storage.setItem("auth_user", JSON.stringify(data.user));
			}

			return data;
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	},
);

export const logoutUser = createAsyncThunk(
	"identity/logout",
	async (_, { rejectWithValue }) => {
		try {
			await fetch(getBaseApiUrl() + "/auth/logout", { method: "POST", credentials: "include" });
			await storage.clear();
			return true;
		} catch (err: any) {
			return rejectWithValue(err.message);
		}
	},
);

export const hydrateAuth = createAsyncThunk("identity/hydrate", async () => {
	const token = await storage.getItem("auth_token");
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(getBaseApiUrl() + "/auth/me", {
		headers,
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("No valid session");
	}

	const data = await response.json();
	return { token, user: data.user };
});

const identitySlice = createSlice({
	name: "identity",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.isAuthenticated = true;
				state.user = action.payload.user;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})
			.addCase(logoutUser.pending, (state) => {
				state.status = "loading";
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.user = null;
				state.status = "succeeded";
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload as string;
			})
			.addCase(hydrateAuth.pending, (state) => {
				state.status = "loading";
			})
			.addCase(hydrateAuth.fulfilled, (state, action) => {
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.status = "succeeded";
			})
			.addCase(hydrateAuth.rejected, (state) => {
				state.isAuthenticated = false;
				state.status = "succeeded";
			});
	},
});

export default identitySlice.reducer;
