function Toast({ message, onClose }) {
  if (!message) return null

  return (
    <div className="toast" role="status" aria-live="polite">
      <div className="toast__inner">
        <span className="toast__dot" aria-hidden="true" />
        <p className="toast__message">{message}</p>
        <button type="button" className="toast__close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
