import { toast, ToastOptions } from 'react-toastify';

const defaultOpts: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

export const showSuccess = (message: string, opts?: ToastOptions) => {
  toast.success(message, { ...defaultOpts, ...opts });
};

export const showError = (message: string, opts?: ToastOptions) => {
  toast.error(message, { ...defaultOpts, ...opts });
};

export const showInfo = (message: string, opts?: ToastOptions) => {
  toast.info(message, { ...defaultOpts, ...opts });
};
