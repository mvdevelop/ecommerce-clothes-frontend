import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthResponse } from '../../types';

const url = 'http://localhost:4000';

interface AuthState {
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('auth-token'),
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

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload
>('auth/login', async ({ email, password }) => {
  const res = await fetch(`${url}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
});

export const signupUser = createAsyncThunk<
  AuthResponse,
  SignupPayload
>('auth/signup', async ({ username, email, password }) => {
  const res = await fetch(`${url}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      localStorage.removeItem('auth-token');
    },
    setToken(state, action) {
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
          localStorage.setItem('auth-token', action.payload.token);
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
          localStorage.setItem('auth-token', action.payload.token);
        }
      })
      .addCase(signupUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;

export default authSlice.reducer;
