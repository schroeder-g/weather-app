import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { storage } from '@/lib/storage';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface IdentityState {
  isAuthenticated: boolean;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IdentityState = {
  isAuthenticated: false,
  user: null,
  status: 'idle',
  error: null,
};

export const loginUser = createAsyncThunk(
  'identity/login',
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.whether.io/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      await storage.setItem('auth_token', data.token);
      await storage.setItem('auth_user', JSON.stringify(data.user));

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'identity/logout',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('https://api.whether.io/auth/logout', { method: 'POST' });
      await storage.removeItem('auth_token');
      await storage.removeItem('auth_user');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const hydrateAuth = createAsyncThunk(
  'identity/hydrate',
  async () => {
    const token = await storage.getItem('auth_token');
    const userStr = await storage.getItem('auth_user');
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
    throw new Error('No auth state found');
  }
);

const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(hydrateAuth.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = 'succeeded';
      });
  },
});

export default identitySlice.reducer;
