import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="17" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="19" cy="17" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 17L10 7H14L19 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 7V5M12 5L10 3M12 5L14 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.logoText}>
            Baika<strong>Max</strong>
            <span className={styles.logoSub}>Store · Bicicletas Premium</span>
          </span>
        </Link>

        <ul className={styles.links}>
          <li>
            <Link to="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/ventas" className={`${styles.link} ${pathname === '/ventas' ? styles.active : ''}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Catálogo
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className={`${styles.link} ${styles.adminLink} ${pathname.startsWith('/admin') ? styles.active : ''}`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Panel Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
