import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, refreshToken as apiRefreshToken, autoLogin as apiAutoLogin } from '../../utils/api'; // Importing relevant API functions
import { LoginPayload, User } from '../../types/user'; // Adjust the import to use User type

interface AuthState {
  user: User | null;
  error: string | null; // To store error messages
  isLoggedIn: boolean; // To track login status
}

const initialState: AuthState = {
  user: null,
  error: null,
  isLoggedIn: false, // Default to false when not logged in
};

// Thunk for logging in
export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const user = await login(username, password); // Use the login function from api.ts
      return user;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

// Thunk for refreshing token
export const refreshToken = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      await apiRefreshToken(); // Call the refresh token function from api.ts
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error occurred');
    }
  }
);

// Thunk for auto login
export const autoLogin = createAsyncThunk<User | null, void, { rejectValue: string }>(
  'auth/autoLogin',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiAutoLogin(); // Call the autoLogin function from api.ts
      return user; // Return user info or null if not logged in
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Auto login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null; // Clear error on logout
      state.isLoggedIn = false; // Set to false on logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload; // User data returned from login
        state.isLoggedIn = true; // Set to true on successful login
        state.error = null; // Clear any previous error
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Login failed'; // Update error state
        state.isLoggedIn = false; // Set to false on login failure
        console.error('Login error:', state.error);
      })
      .addCase(refreshToken.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Refresh token failed'; // Update error state
        console.error('Refresh error:', state.error);
      })
      .addCase(autoLogin.fulfilled, (state, action: PayloadAction<User | null>) => {
        if (action.payload) {
          state.user = action.payload; // Set user if auto-login is successful
          state.isLoggedIn = true; // User is logged in
        } else {
          state.user = null; // No user info available
          state.isLoggedIn = false; // User is not logged in
        }
        state.error = null; // Clear error on auto login success
      })
      .addCase(autoLogin.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload || 'Auto login failed'; // Update error state
        console.error('Auto login error:', state.error);
      });
  },
});

// Export actions and selector
export const { logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;

export default authSlice.reducer;
