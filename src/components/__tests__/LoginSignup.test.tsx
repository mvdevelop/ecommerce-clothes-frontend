import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import LoginSignup from '../LoginSignup';
import { loginUser, signupUser } from '../../store/slices/authSlice';

const mockStore = configureStore([thunk]);

const initialState = {
  auth: {
    token: null,
    user: null,
    loading: false,
    error: null,
    csrfToken: null,
  },
  products: {
    allProducts: [],
    popular: [],
    newCollections: [],
    loading: false,
    error: null,
    lastFetch: { allProducts: 0, popular: 0, newCollections: 0 },
  },
};

describe('LoginSignup Component', () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    store = mockStore(initialState);
    mockDispatch = store.dispatch;
  });

  afterEach(() => {
    store.clearActions();
  });

  test('renders login form by default', () => {
    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Your Name')).not.toBeInTheDocument();
  });

  test('switches to sign up form', () => {
    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    fireEvent.click(screen.getByText('Click here'));

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  test('handles login form submission successfully', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-jwt-token',
      user: { name: 'Test User', email: 'test@example.com' },
      errors: null,
    };

    mockDispatch.mockImplementation((action) => {
      if (loginUser.fulfilled.match(action)) {
        return Promise.resolve({ payload: mockResponse });
      }
    });

    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginUser({ email: 'test@example.com', password: 'password123' })
      );
    });
  });

  test('handles login form submission with error', async () => {
    const mockResponse = {
      success: false,
      errors: 'Invalid credentials',
    };

    mockDispatch.mockImplementation((action) => {
      if (loginUser.fulfilled.match(action)) {
        return Promise.resolve({ payload: mockResponse });
      }
    });

    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginUser({ email: 'test@example.com', password: 'wrongpassword' })
      );
    });
  });

  test('handles sign up form submission successfully', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-jwt-token',
      user: { name: 'New User', email: 'newuser@example.com' },
      errors: null,
    };

    mockDispatch.mockImplementation((action) => {
      if (signupUser.fulfilled.match(action)) {
        return Promise.resolve({ payload: mockResponse });
      }
    });

    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    // Switch to sign up
    fireEvent.click(screen.getByText('Click here'));

    fireEvent.change(screen.getByPlaceholderText('Your Name'), {
      target: { name: 'username', value: 'New User' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { name: 'email', value: 'newuser@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        signupUser({
          username: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        })
      );
    });
  });

  test('displays loading state during form submission', async () => {
    mockDispatch.mockImplementation((action) => {
      if (loginUser.pending.match(action)) {
        return Promise.resolve();n      }
      if (loginUser.fulfilled.match(action)) {
        return Promise.resolve({ payload: { success: true, token: 'token', user: {} } });
      }
    });

    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { name: 'email', value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { name: 'password', value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(screen.getByText('Aguarde...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('does not submit form when fields are empty', () => {
    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /Continue/i })).toBeDisabled();
  });

  test('switches between login and sign up tabs multiple times', () => {
    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    // Switch to sign up
    fireEvent.click(screen.getByText('Click here'));
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();

    // Switch back to login
    fireEvent.click(screen.getByText('Login here'));
    expect(screen.queryByPlaceholderText('Your Name')).not.toBeInTheDocument();

    // Switch to sign up again
    fireEvent.click(screen.getByText('Click here'));
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
  });

  test('renders checkbox for terms agreement', () => {
    render(
      <Provider store={store}>
        <LoginSignup />
      </Provider>
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('By continuing, I agree to the terms of use & privacy policy.')).toBeInTheDocument();
  });
});