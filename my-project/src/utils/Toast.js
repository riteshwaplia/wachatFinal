import { toast } from 'react-hot-toast';
 
export const SuccessToast = (message = 'Saved!') => {
  toast.success(message, {
    // icon: '✅',
    style: {
      borderRadius: '10px',
      background: '#22c55e', // green-500
      color: '#fff',
    },
    duration: 4000,
  });
};
 
export const ErrorToast = (message = 'Something went wrong!') => {
  toast.error(message, {
    // icon: '❌',
    style: {
      borderRadius: '10px',
      background: '#ef4444', // red-500
      color: '#fff',
    },
    duration: 4000,
  });
};