import { useEffect, useState } from 'react';

const TOAST_TYPES = {
  success: {
    icon: '✅',
    classes: 'bg-success-light border-success text-success-dark',
  },
  error: {
    icon: '❌',
    classes: 'bg-danger-light border-danger text-danger-dark',
  },
  warning: {
    icon: '⚠️',
    classes: 'bg-warning-light border-warning text-warning-dark',
  },
  info: {
    icon: 'ℹ️',
    classes: 'bg-primary-50 border-primary-300 text-primary-800',
  },
};

const Toast = ({ id, type = 'info', message, duration = 4000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-card max-w-sm w-full
        transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${config.classes}`}
      role="alert"
    >
      <span className="flex-shrink-0 text-base">{config.icon}</span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => { setIsVisible(false); setTimeout(() => onDismiss(id), 300); }}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

/**
 * ToastContainer renders all active toasts in a fixed position.
 * Use the useToast hook to trigger toasts from anywhere.
 */
export const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
    {toasts.map((toast) => (
      <div key={toast.id} className="pointer-events-auto animate-slide-up">
        <Toast {...toast} onDismiss={onDismiss} />
      </div>
    ))}
  </div>
);

export default Toast;
