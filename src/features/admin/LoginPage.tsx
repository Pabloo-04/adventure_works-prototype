import { useState } from 'react'
import styles from './LoginPage.module.css'

const CREDS = { usuario: 'admin@baika.sv', clave: 'Baika2024!' }

interface LoginPageProps { onLogin: () => void }

export function LoginPage({ onLogin }: LoginPageProps) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [mostrarClave, setMostrarClave] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setCargando(true)
    setTimeout(() => {
      if (usuario === CREDS.usuario && clave === CREDS.clave) {
        onLogin()
      } else {
        setError('Credenciales incorrectas. Intenta nuevamente.')
      }
      setCargando(false)
    }, 900)
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} aria-hidden />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.brandLogo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
              <path d="M5 17L10 7H14L19 17"/><path d="M12 7V4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className={styles.brandName}>Baika<strong>Max</strong> Store</p>
            <p className={styles.brandSub}>Panel Administrativo · Solo personal autorizado</p>
          </div>
        </div>

        <h1 className={styles.title}>Iniciar sesión</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Correo electrónico
            <div className={styles.inputWrapper}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.inputIcon}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" className={styles.input} placeholder="admin@baika.sv"
                value={usuario} onChange={e => setUsuario(e.target.value)}
                autoComplete="username" required />
            </div>
          </label>

          <label className={styles.label}>
            Contrasena
            <div className={styles.inputWrapper}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input type={mostrarClave ? 'text' : 'password'} className={styles.input}
                placeholder="••••••••" value={clave} onChange={e => setClave(e.target.value)}
                autoComplete="current-password" required />
              <button type="button" className={styles.toggleClave} onClick={() => setMostrarClave(v => !v)} tabIndex={-1}>
                {mostrarClave ? '🙈' : '👁'}
              </button>
            </div>
          </label>

          {error && (
            <div className={styles.errorBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className={styles.btnLogin} disabled={cargando}>
            {cargando ? <><span className={styles.spinBtn} /> Verificando…</> : 'Acceder al panel'}
          </button>
        </form>

        <div className={styles.hint}>
          <p className={styles.hintTitle}>Credenciales de demo</p>
          <div className={styles.hintRow}><span>Usuario</span><code>{CREDS.usuario}</code></div>
          <div className={styles.hintRow}><span>Clave</span><code>{CREDS.clave}</code></div>
        </div>
      </div>
    </div>
  )
}
