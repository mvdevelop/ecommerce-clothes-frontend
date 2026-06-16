import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '../../types';

const url = 'http://localhost:4000';

interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null;
  loading: boolean;
}

const storedToken = localStorage.getItem('auth-token');
const storedUser = localStorage.getItem('auth-user');

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
};

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload>(
  'auth/login',
  async ({ email, password }) => {
    const res = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  }
);

export const signupUser = createAsyncThunk<AuthResponse, SignupPayload>(
  'auth/signup',
  async ({ username, email, password }) => {
    const res = await fetch(`${url}/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('auth-token');
      localStorage.removeItem('auth-user');
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user || state.user;
          localStorage.setItem('auth-token', action.payload.token);
          if (action.payload.user) {
            localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
          }
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user || state.user;
          localStorage.setItem('auth-token', action.payload.token);
          if (action.payload.user) {
            localStorage.setItem('auth-user', JSON.stringify(action.payload.user));
          }
        }
      })
      .addCase(signupUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;

export default authSlice.reducer;
