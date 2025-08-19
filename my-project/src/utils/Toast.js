import { toast } from 'react-hot-toast';

// Track last toast time
let lastToastTime = 0;
const TOAST_DELAY = 4000; // 3 seconds

const canShowToast = () => {
  const now = Date.now();
  if (now - lastToastTime > TOAST_DELAY) {
    lastToastTime = now;
    return true;
  }
  return false;
};

export const SuccessToast = (message = 'Saved!') => {
  if (!canShowToast()) return;
  toast.success(message, {  
    style: {
      borderRadius: '6px',
      background: '#1f1f1f', // black-gray
      color: '#fff',
      borderLeft: '4px solid #22c55e', // green border
      padding: '12px 16px',
      fontSize: '14px',
    },
    duration: 4000,
  });
};

export const ErrorToast = (message = 'Something went wrong!') => {
  if (!canShowToast()) return;
  toast.error(message, {
    style: {
      borderRadius: '6px',
      background: '#1f1f1f', // black-gray
      color: '#fff',
      borderLeft: '4px solid #ef4444', // red border
      padding: '12px 16px',
      fontSize: '14px',
    },
    duration: 4000,
  });
};
