import { useState } from 'react'
import { facturas } from '../../data/facturas'
import type { EstadoDTE, TipoDTE } from '../../types'
import { LoginPage } from './LoginPage'
import styles from './AdminPage.module.css'

const LABEL_TIPO: Record<TipoDTE, string> = {
  '01': 'Factura (01)',
  '03': 'CCF (03)',
}

const LABEL_ESTADO: Record<EstadoDTE, string> = {
  PROCESADO: 'Procesado',
  RECHAZADO: 'Rechazado',
  PENDIENTE: 'Pendiente',
  CONTINGENCIA: 'Contingencia',
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatMoneda(n: number) {
  return `$${n.toFixed(2)}`
}

export function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState<EstadoDTE | 'TODOS'>('TODOS')
  const [filtroTipo, setFiltroTipo] = useState<TipoDTE | 'TODOS'>('TODOS')
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  if (!autenticado) {
    return <LoginPage onLogin={() => setAutenticado(true)} />
  }

  const facturasFiltradas = facturas.filter(f => {
    const pasaEstado = filtroEstado === 'TODOS' || f.estado === filtroEstado
    const pasaTipo = filtroTipo === 'TODOS' || f.tipoDTE === filtroTipo
    return pasaEstado && pasaTipo
  })

  const totalProcesado = facturas
    .filter(f => f.estado === 'PROCESADO')
    .reduce((a, f) => a + f.total, 0)

  const dte = seleccionado ? facturas.find(f => f.dteId === seleccionado) : null

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span>⚙</span>
          <span>Baika<strong>Max</strong></span>
        </div>

        <nav className={styles.sidebarNav}>
          <button className={`${styles.navItem} ${styles.navActive}`}>
            🧾 Facturación DTE
          </button>
          <button className={styles.navItem}>📦 Inventario</button>
          <button className={styles.navItem}>📊 Reportes</button>
          <button className={styles.navItem}>👤 Usuarios</button>
        </nav>

        <div className={styles.sidebarEmisор}>
          <p className={styles.emisorLabel}>Emisor</p>
          <p className={styles.emisorNombre}>Baika Max Store</p>
          <p className={styles.emisorNIT}>NIT: 0614-220180-101-9</p>
          <p className={styles.emisorNRC}>NRC: 123456-7</p>
        </div>

        <button className={styles.logoutBtn} onClick={() => setAutenticado(false)}>
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1 className={styles.pageTitle}>Facturación Electrónica DTE</h1>
            <p className={styles.pageSubtitle}>
              Transmisiones al Ministerio de Hacienda · DGII El Salvador
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Total emitidos</span>
            <span className={styles.kpiValue}>{facturas.length}</span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Procesados</span>
            <span className={`${styles.kpiValue} ${styles.kpiSuccess}`}>
              {facturas.filter(f => f.estado === 'PROCESADO').length}
            </span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Pendientes</span>
            <span className={`${styles.kpiValue} ${styles.kpiWarning}`}>
              {facturas.filter(f => f.estado === 'PENDIENTE').length}
            </span>
          </div>
          <div className={styles.kpi}>
            <span className={styles.kpiLabel}>Rechazados</span>
            <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>
              {facturas.filter(f => f.estado === 'RECHAZADO').length}
            </span>
          </div>
          <div className={`${styles.kpi} ${styles.kpiWide}`}>
            <span className={styles.kpiLabel}>Total facturado (procesados)</span>
            <span className={`${styles.kpiValue} ${styles.kpiPrimary}`}>
              {formatMoneda(totalProcesado)}
            </span>
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtros}>
          <select
            className={styles.select}
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value as EstadoDTE | 'TODOS')}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PROCESADO">Procesado</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECHAZADO">Rechazado</option>
            <option value="CONTINGENCIA">Contingencia</option>
          </select>

          <select
            className={styles.select}
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value as TipoDTE | 'TODOS')}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="01">Factura (01)</option>
            <option value="03">CCF (03)</option>
          </select>

          <span className={styles.resultCount}>
            {facturasFiltradas.length} resultado{facturasFiltradas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabla */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nº Control</th>
                <th>Tipo</th>
                <th>Receptor</th>
                <th>Fecha emisión</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map(f => (
                <tr
                  key={f.dteId}
                  className={seleccionado === f.dteId ? styles.rowSelected : ''}
                  onClick={() => setSeleccionado(prev => prev === f.dteId ? null : f.dteId)}
                >
                  <td>
                    <code className={styles.code}>{f.numeroControl}</code>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${f.tipoDTE === '03' ? styles.badgeCCF : styles.badgeFE}`}>
                      {LABEL_TIPO[f.tipoDTE]}
                    </span>
                  </td>
                  <td>
                    <p className={styles.receptorNombre}>{f.receptorNombre}</p>
                    <p className={styles.receptorDUI}>{f.receptorDUI}</p>
                  </td>
                  <td className={styles.fecha}>{formatFecha(f.fechaEmision)}</td>
                  <td>{formatMoneda(f.subtotal)}</td>
                  <td>{formatMoneda(f.iva)}</td>
                  <td className={styles.totalCell}>{formatMoneda(f.total)}</td>
                  <td>
                    <span className={`${styles.estadoBadge} ${styles[`estado${f.estado}`]}`}>
                      {LABEL_ESTADO[f.estado]}
                    </span>
                  </td>
                  <td>
                    <button className={styles.verBtn} onClick={e => {
                      e.stopPropagation()
                      setSeleccionado(prev => prev === f.dteId ? null : f.dteId)
                    }}>
                      {seleccionado === f.dteId ? 'Ocultar' : 'Detalle'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {facturasFiltradas.length === 0 && (
            <div className={styles.empty}>
              No hay documentos que coincidan con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Detalle DTE */}
        {dte && (
          <div className={styles.dteDetalle}>
            <div className={styles.dteDetalleHeader}>
              <h3>Detalle DTE — {dte.numeroControl}</h3>
              <button onClick={() => setSeleccionado(null)} className={styles.cerrarDetalle}>✕</button>
            </div>

            <div className={styles.dteGrid}>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>Código de Generación</span>
                <code className={styles.dteFieldValue}>{dte.codigoGeneracion}</code>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>Sello de Recepción MH</span>
                <code className={styles.dteFieldValue}>
                  {dte.selloRecepcion ?? '— Sin sello (no procesado)'}
                </code>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>Tipo de DTE</span>
                <span className={styles.dteFieldValue}>{LABEL_TIPO[dte.tipoDTE]}</span>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>Estado DGII</span>
                <span className={`${styles.estadoBadge} ${styles[`estado${dte.estado}`]}`}>
                  {LABEL_ESTADO[dte.estado]}
                </span>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>NIT Emisor</span>
                <span className={styles.dteFieldValue}>{dte.emisorNIT}</span>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>NRC Emisor</span>
                <span className={styles.dteFieldValue}>{dte.emisorNRC}</span>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>Receptor</span>
                <span className={styles.dteFieldValue}>{dte.receptorNombre}</span>
              </div>
              <div className={styles.dteField}>
                <span className={styles.dteFieldLabel}>DUI / NIT Receptor</span>
                <span className={styles.dteFieldValue}>{dte.receptorDUI}</span>
              </div>
            </div>

            <div className={styles.dteTotales}>
              <div className={styles.totalRow}>
                <span>Subtotal sin IVA</span>
                <span>{formatMoneda(dte.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>IVA (13%)</span>
                <span>{formatMoneda(dte.iva)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                <span>Total</span>
                <span>{formatMoneda(dte.total)}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
