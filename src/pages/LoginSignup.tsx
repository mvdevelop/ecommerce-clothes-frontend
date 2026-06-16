import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  signupUser,
  selectAuthLoading,
} from '../store/slices/authSlice';
import { showSuccess, showError } from '../services/toastService';

interface FormData {
  username: string;
  password: string;
  email: string;
}

function LoginSignup() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const [state, setState] = useState<string>('Login');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    const result = await dispatch(
      loginUser({ email: formData.email, password: formData.password })
    );
    if (loginUser.fulfilled.match(result)) {
      if (result.payload.success) {
        showSuccess('Login realizado com sucesso!');
        window.location.replace('/');
        return;
      }
      showError(result.payload.errors || 'Erro ao fazer login');
    } else {
      showError('Erro ao fazer login');
    }
  };

  const signup = async () => {
    const result = await dispatch(
      signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    );
    if (signupUser.fulfilled.match(result)) {
      if (result.payload.success) {
        showSuccess('Conta criada com sucesso!');
        window.location.replace('/');
        return;
      }
      showError(result.payload.errors || 'Erro ao criar conta');
    } else {
      showError('Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 70,
          mass: 1,
        }}
      >
        <h1 className="text-2xl font-semibold text-center mb-8">{state}</h1>
        <div className="space-y-4">
          {state === 'Sign Up' && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-sm"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-sm"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-sm"
          />
        </div>
        <button
          disabled={loading}
          onClick={() => (state === 'Login' ? login() : signup())}
          className="w-full mt-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 active:scale-[0.98] transition-all rounded-full text-white font-medium"
        >
          {loading ? 'Aguarde...' : 'Continue'}
        </button>

        <div className="mt-6 text-center text-sm">
          {state === 'Sign Up' ? (
            <p className="text-slate-400">
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-pink-500 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-slate-400">
              Create an account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-pink-500 hover:underline cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
          <input type="checkbox" className="mt-0.5 accent-pink-600" />
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginSignup;
