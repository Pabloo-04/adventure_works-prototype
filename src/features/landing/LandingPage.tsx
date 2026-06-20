import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

export function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Sistema de Gestión Comercial</span>
          <h1 className={styles.title}>
            Baika <span>Max Store</span>
          </h1>
          <p className={styles.subtitle}>
            Plataforma integrada de ventas, inventario y facturación electrónica
            bajo el estándar DTE del Ministerio de Hacienda de El Salvador.
          </p>
          <div className={styles.heroActions}>
            <Link to="/ventas" className={styles.btnPrimary}>
              Ver catálogo
            </Link>
            <Link to="/admin" className={styles.btnSecondary}>
              Acceso Admin
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80"
            alt="Bicicletas Baika Max Store"
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Módulos del sistema</h2>
          <p className={styles.sectionSubtitle}>
            Diseñado para los tres roles de la operación
          </p>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛒</div>
              <h3>Catálogo & Ventas</h3>
              <p>
                Gestión de productos Adventure Works con control de stock en
                tiempo real y carrito de compras integrado.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧾</div>
              <h3>Facturación DTE</h3>
              <p>
                Emisión de Facturas (01) y CCF (03) con transmisión automática
                a la API del Ministerio de Hacienda (DGII).
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Reportes & Dashboard</h3>
              <p>
                KPIs de ventas, inventario y facturación con exportación PDF
                y auditoría de transmisiones DTE.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>Roles & Accesos</h3>
              <p>
                Tres perfiles: Administrador, Vendedor y Cliente. Autenticación
                JWT con refresh token y control de sesión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Roles de usuario</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>DTE</span>
              <span className={styles.statLabel}>Facturación electrónica MH</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>13%</span>
              <span className={styles.statLabel}>IVA aplicado automáticamente</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10 años</span>
              <span className={styles.statLabel}>Retención de logs DTE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>
            © 2024 Baika Max Store · Práctica Profesional I · UCA El Salvador
          </p>
          <p className={styles.footerTeam}>
            Avalos · Cabrera · Caprile · Valiente · Vides
          </p>
        </div>
      </footer>
    </main>
  )
}
