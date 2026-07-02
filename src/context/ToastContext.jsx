import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import './ToastContext.css'

const ToastContext = createContext(null)

let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback(
    (message, { type = 'error', duration = 5000 } = {}) => {
      if (!message) return
      const id = ++idSeq
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  const showError = useCallback((message, opts) => showToast(message, { ...opts, type: 'error' }), [showToast])
  const showSuccess = useCallback((message, opts) => showToast(message, { ...opts, type: 'success' }), [showToast])
  const showInfo = useCallback((message, opts) => showToast(message, { ...opts, type: 'info' }), [showToast])

  const value = useMemo(
    () => ({ showToast, showError, showSuccess, showInfo, dismiss }),
    [showToast, showError, showSuccess, showInfo, dismiss],
  )

  const icons = { error: AlertCircle, success: CheckCircle2, info: Info }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notifications">
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info
          return (
            <div key={t.id} className={`toast toast--${t.type}`} role="alert">
              <span className="toast__icon" aria-hidden="true">
                <Icon size={18} strokeWidth={1.8} />
              </span>
              <span className="toast__message">{t.message}</span>
              <button
                type="button"
                className="toast__close"
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
              >
                <X size={16} strokeWidth={1.8} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
