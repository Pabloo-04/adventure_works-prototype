import { useState } from 'react'
import styles from './LoginPage.module.css'

const CREDENCIALES = { usuario: 'admin@baika.sv', clave: 'Baika2024!' }

interface LoginPageProps {
  onLogin: () => void
}

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
      if (usuario === CREDENCIALES.usuario && clave === CREDENCIALES.clave) {
        onLogin()
      } else {
        setError('Credenciales incorrectas. Verifique su usuario y contraseña.')
      }
      setCargando(false)
    }, 800)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚙</span>
          <span className={styles.brandName}>
            Baika<strong>Max</strong> Admin
          </span>
        </div>

        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Módulo administrativo · Sólo personal autorizado</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Correo electrónico
            <input
              type="email"
              className={styles.input}
              placeholder="admin@baika.sv"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label className={styles.label}>
            Contraseña
            <div className={styles.inputWrapper}>
              <input
                type={mostrarClave ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                value={clave}
                onChange={e => setClave(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.toggleClave}
                onClick={() => setMostrarClave(v => !v)}
                tabIndex={-1}
              >
                {mostrarClave ? '🙈' : '👁'}
              </button>
            </div>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btnLogin} disabled={cargando}>
            {cargando ? 'Verificando…' : 'Acceder'}
          </button>
        </form>

        <div className={styles.hint}>
          <p>Credenciales de prueba:</p>
          <code>{CREDENCIALES.usuario} / {CREDENCIALES.clave}</code>
        </div>
      </div>
    </div>
  )
}
