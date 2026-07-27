import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse } from '../../types';
import AuthService from '../../services/authService';
import { showSuccess, showError } from '../../services/toastService';

interface AuthState {
  token: string | null;
  user: { name: string; email: string } | null;
  loading: boolean;
  error: string | null;
  csrfToken: string | null;
}

const initialState: AuthState = {
  token: AuthService.getInstance().getToken(),
  user: AuthService.getInstance().getUser(),
  loading: false,
  error: null,
  csrfToken: null,
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

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const sanitizedEmail = email.toLowerCase().trim();
      const response = await AuthService.getInstance().login({
        email: sanitizedEmail,
        password,
      });

      // Clear any previous errors
      dispatch(clearAuthError());

      // Generate CSRF token after successful login
      const csrfToken = AuthService.getInstance().generateCSRFToken();
      dispatch(setCsrfToken(csrfToken));

      showSuccess('Login realizado com sucesso!');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk<AuthResponse, SignupPayload, { rejectValue: string }>(
  'auth/signup',
  async ({ username, email, password }, { rejectWithValue, dispatch }) => {
    try {
      const sanitizedEmail = email.toLowerCase().trim();
      const sanitizedUsername = username.trim();

      if (sanitizedUsername.length < 2) {
        const errorMsg = 'Username must be at least 2 characters long';
        showError(errorMsg);
        return rejectWithValue(errorMsg);
      }

      const response = await AuthService.getInstance().login({
        username: sanitizedUsername,
        email: sanitizedEmail,
        password,
      });

      // Clear any previous errors
      dispatch(clearAuthError());

      // Generate CSRF token after successful signup
      const csrfToken = AuthService.getInstance().generateCSRFToken();
      dispatch(setCsrfToken(csrfToken));

      showSuccess('Account created successfully!');
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Call logout method from AuthService
      AuthService.getInstance().logout();

      dispatch(clearAuthError());
      dispatch(setCsrfToken(null));

      showSuccess('Logout realizado com sucesso');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.csrfToken = null;
      AuthService.getInstance().logout();
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setCsrfToken(state, action: PayloadAction<string | null>) {
      state.csrfToken = action.payload;
    },
    refreshAuthState(state) {
      state.token = AuthService.getInstance().getToken();
      state.user = AuthService.getInstance().getUser();
      state.csrfToken = state.token ? AuthService.getInstance().generateCSRFToken() : null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = AuthService.getInstance().getToken();
        state.user = AuthService.getInstance().getUser();

        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user || state.user;
        } else {
          state.error = action.payload.errors || 'Login failed';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = AuthService.getInstance().getToken();
        state.user = AuthService.getInstance().getUser();

        if (action.payload.success && action.payload.token) {
          state.token = action.payload.token;
          state.user = action.payload.user || state.user;
        } else {
          state.error = action.payload.errors || 'Signup failed';
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Signup failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.error = null;
        state.csrfToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const {
  logout,
  setToken,
  clearAuthError,
  setCsrfToken,
  refreshAuthState
} = authSlice.actions;

export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectCsrfToken = (state: { auth: AuthState }) => state.auth.csrfToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.token && !!state.auth.user;

export default authSlice.reducer;
