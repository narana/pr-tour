export default function StatusToast({ toast, onDismiss }) {
  if (!toast?.message) {
    return null;
  }

  return (
    <div className="status-toast-region" aria-live="polite" aria-atomic="true">
      <div className={`status-toast status-toast--${toast.variant || 'info'}`} data-testid="status-toast" role="status">
        <span className="status-toast__message">{toast.message}</span>
        <button
          type="button"
          className="status-toast__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss status message"
        >
          ×
        </button>
      </div>
    </div>
  );
}