import { Link, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚙</span>
          <span>Baika<strong>Max</strong></span>
        </Link>

        <ul className={styles.links}>
          <li>
            <Link to="/" className={pathname === '/' ? styles.active : ''}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/ventas" className={pathname === '/ventas' ? styles.active : ''}>
              Catálogo
            </Link>
          </li>
          <li>
            <Link to="/admin" className={`${styles.adminLink} ${pathname.startsWith('/admin') ? styles.active : ''}`}>
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
