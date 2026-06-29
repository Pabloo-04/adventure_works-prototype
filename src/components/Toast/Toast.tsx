import type { Toast, ToastType } from '../../hooks/useToast'
import styles from './Toast.module.css'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null
  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>{ICONS[toast.type]}</span>
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.close} onClick={() => onRemove(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
