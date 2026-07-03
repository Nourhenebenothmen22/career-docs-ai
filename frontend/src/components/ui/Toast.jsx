import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useAppStore from '../../store/useAppStore';

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: CheckCircleIcon,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

function ToastItem({ toast }) {
  const removeToast = useAppStore(s => s.removeToast);
  const Icon = icons[toast.type] || icons.info;

  return (
    <div className={`flex items-start gap-3 rounded-card border px-4 py-3 shadow-lg ${colors[toast.type] || colors.info}`} role="alert">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-caption font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
        aria-label="Dismiss notification"
      >
        <XMarkIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useAppStore(s => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm" aria-live="polite" aria-label="Notifications">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
