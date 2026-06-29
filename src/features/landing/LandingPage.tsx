import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
        <path d="M5 17L10 7H14L19 17"/><path d="M12 7V4" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Catálogo de Bicicletas',
    desc: 'Mountain, Road y Touring con imágenes, descripciones técnicas, precios con IVA y control de inventario en tiempo real.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    title: 'Carrito & Ventas',
    desc: 'Flujo completo de venta con carrito interactivo, cálculo automático de IVA (13%) y alertas de stock insuficiente.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Facturación DTE',
    desc: 'Emisión de Facturas (01), CCF (03), Notas de Crédito (05) y Remisión (06) bajo normativa DGII El Salvador.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Gestión de Inventario',
    desc: 'Panel admin con tabla de productos, alertas de stock bajo, creación de nuevos ítems y persistencia en LocalStorage.',
  },
]

const STATS = [
  { value: '4', label: 'Tipos de DTE soportados' },
  { value: '13%', label: 'IVA aplicado automáticamente' },
  { value: 'DGII', label: 'Normativa MH El Salvador' },
  { value: '10+', label: 'Productos en catálogo' },
]

export function LandingPage() {
  return (
    <main className={styles.main}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.heroContent}>
          <span className={styles.heroPill}>
            <span className={styles.heroPillDot} /> Sistema de Gestión Comercial · El Salvador
          </span>
          <h1 className={styles.heroTitle}>
            La tienda de bicicletas{' '}
            <span className={styles.heroAccent}>premium</span>{' '}
            ahora con facturación electrónica
          </h1>
          <p className={styles.heroDesc}>
            <strong>Baika Max Store</strong> — plataforma integrada de ventas, inventario y DTE
            bajo el estándar del Ministerio de Hacienda de El Salvador. Gestiona bicicletas
            Mountain, Road, Touring y accesorios desde un solo lugar.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/ventas" className={styles.ctaPrimary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
                <path d="M5 17L10 7H14L19 17"/>
              </svg>
              Ver catálogo de bicis
            </Link>
            <Link to="/admin" className={styles.ctaSecondary}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Panel Admin
            </Link>
          </div>
          <div className={styles.heroCredentials}>
            <span>🔐 Credenciales demo:</span>
            <code>admin@baika.sv</code>
            <span>/</span>
            <code>Baika2024!</code>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroImageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&q=85"
              alt="Mountain bike premium Baika Max Store"
              className={styles.heroImage}
            />
            <div className={styles.heroImageGlow} />
          </div>

          <div className={styles.heroCard} style={{ top: '10%', right: '-20px' }}>
            <span className={styles.heroCardIcon}>🚲</span>
            <div>
              <p className={styles.heroCardLabel}>Mountain-200 Black</p>
              <p className={styles.heroCardValue}>$2,593.34 <small>c/IVA</small></p>
            </div>
          </div>

          <div className={styles.heroCard} style={{ bottom: '18%', left: '-24px' }}>
            <span className={styles.heroCardIcon} style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>✓</span>
            <div>
              <p className={styles.heroCardLabel}>DTE emitido</p>
              <p className={styles.heroCardValue} style={{ color: 'var(--success)' }}>PROCESADO MH</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats}>
        <div className={styles.container}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Todo lo que necesitas en un solo sistema</h2>
            <p className={styles.sectionDesc}>
              Diseñado para vendedores, administradores y clientes de Baika Max Store
            </p>
          </div>
          <div className={styles.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <div className={styles.ctaBannerInner}>
            <div>
              <h2 className={styles.ctaBannerTitle}>¿Listo para comenzar?</h2>
              <p className={styles.ctaBannerDesc}>Explora el catálogo o accede al panel de administración</p>
            </div>
            <div className={styles.ctaBannerActions}>
              <Link to="/ventas" className={styles.ctaPrimary}>Ir al catálogo →</Link>
              <Link to="/admin" className={styles.ctaSecondary}>Panel Admin</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>🚲 Baika<strong>Max</strong> Store</span>
            <p className={styles.footerTagline}>Bicicletas y accesorios premium · San Salvador, El Salvador</p>
          </div>
          <p className={styles.footerCopy}>
            © 2024 Baika Max Store · Práctica Profesional I · UCA · Avalos · Cabrera · Caprile · Valiente · Vides
          </p>
        </div>
      </footer>
    </main>
  )
}
