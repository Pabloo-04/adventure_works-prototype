import { useState } from 'react'
import type { EstadoDTE, TipoDTE, Producto } from '../../types'
import { facturas as facturasIniciales } from '../../data/facturas'
import { productosIniciales } from '../../data/productos'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { LoginPage } from './LoginPage'
import styles from './AdminPage.module.css'

type TabAdmin = 'facturacion' | 'inventario'

const LABEL_TIPO: Record<TipoDTE, string> = {
  '01': 'Factura (01)',
  '03': 'CCF (03)',
  '05': 'N. Crédito (05)',
  '06': 'N. Remisión (06)',
}

const LABEL_ESTADO: Record<EstadoDTE, string> = {
  PROCESADO:    'Procesado',
  RECHAZADO:    'Rechazado',
  PENDIENTE:    'Pendiente',
  CONTINGENCIA: 'Contingencia',
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function fmt(n: number) { return `$${n.toFixed(2)}` }

const PRODUCTO_VACIO: Omit<Producto, 'productoId'> = {
  nombre: '',
  numeroProducto: '',
  categoria: 'Mountain Bikes',
  precio: 0,
  stock: 0,
  umbralMinimo: 5,
  imagen: '',
  descripcion: '',
  activo: true,
}

const CATEGORIAS = ['Mountain Bikes', 'Road Bikes', 'Touring Bikes', 'Helmets', 'Accesorios']

export function AdminPage() {
  const [autenticado, setAutenticado] = useState(false)
  const [tabActiva, setTabActiva] = useState<TabAdmin>('facturacion')

  // Facturación state
  const [filtroEstado, setFiltroEstado] = useState<EstadoDTE | 'TODOS'>('TODOS')
  const [filtroTipo, setFiltroTipo] = useState<TipoDTE | 'TODOS'>('TODOS')
  const [seleccionado, setSeleccionado] = useState<string | null>(null)

  // Inventario state
  const [productos, setProductos] = useLocalStorage<Producto[]>('baika_productos', productosIniciales)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Producto, 'productoId'>>(PRODUCTO_VACIO)
  const [formError, setFormError] = useState('')
  const [busquedaInv, setBusquedaInv] = useState('')

  if (!autenticado) {
    return <LoginPage onLogin={() => setAutenticado(true)} />
  }

  // ── Facturación ──
  const facturasFiltradas = facturasIniciales.filter(f => {
    const pasaEstado = filtroEstado === 'TODOS' || f.estado === filtroEstado
    const pasaTipo   = filtroTipo   === 'TODOS' || f.tipoDTE === filtroTipo
    return pasaEstado && pasaTipo
  })

  const totalProcesado = facturasIniciales
    .filter(f => f.estado === 'PROCESADO')
    .reduce((a, f) => a + f.total, 0)

  const dte = seleccionado ? facturasIniciales.find(f => f.dteId === seleccionado) : null

  // ── Inventario ──
  const productosFiltrados = productos.filter(p =>
    !busquedaInv.trim() ||
    p.nombre.toLowerCase().includes(busquedaInv.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busquedaInv.toLowerCase()) ||
    p.numeroProducto.toLowerCase().includes(busquedaInv.toLowerCase())
  )

  const stockBajoCount = productos.filter(p => p.stock <= p.umbralMinimo && p.activo).length

  function handleFormChange(field: keyof typeof form, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormError('')
  }

  function handleGuardarProducto() {
    if (!form.nombre.trim()) { setFormError('El nombre es requerido.'); return }
    if (!form.numeroProducto.trim()) { setFormError('El número de producto es requerido.'); return }
    if (form.precio <= 0) { setFormError('El precio debe ser mayor a 0.'); return }
    if (form.stock < 0) { setFormError('El stock no puede ser negativo.'); return }

    if (editandoId) {
      setProductos(prev => prev.map(p =>
        p.productoId === editandoId ? { ...form, productoId: editandoId } : p
      ))
    } else {
      const newId = `PROD-${Date.now()}`
      setProductos(prev => [...prev, { ...form, productoId: newId }])
    }
    setForm(PRODUCTO_VACIO)
    setEditandoId(null)
    setMostrarFormulario(false)
  }

  function handleEditar(p: Producto) {
    const { productoId, ...rest } = p
    setForm(rest)
    setEditandoId(productoId)
    setMostrarFormulario(true)
  }

  function handleEliminar(productoId: string) {
    if (!confirm('¿Eliminar este producto del catálogo?')) return
    setProductos(prev => prev.filter(p => p.productoId !== productoId))
  }

  function handleToggleActivo(productoId: string) {
    setProductos(prev => prev.map(p =>
      p.productoId === productoId ? { ...p, activo: !p.activo } : p
    ))
  }

  function handleCancelarForm() {
    setForm(PRODUCTO_VACIO)
    setEditandoId(null)
    setMostrarFormulario(false)
    setFormError('')
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.brandLogo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
              <path d="M5 17L10 7H14L19 17"/><path d="M12 7V4" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className={styles.brandName}>Baika<strong>Max</strong></p>
            <p className={styles.brandSub}>Panel Administrativo</p>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${tabActiva === 'facturacion' ? styles.navActive : ''}`}
            onClick={() => setTabActiva('facturacion')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Facturación DTE
            <span className={styles.navBadge}>{facturasIniciales.length}</span>
          </button>
          <button
            className={`${styles.navItem} ${tabActiva === 'inventario' ? styles.navActive : ''}`}
            onClick={() => setTabActiva('inventario')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Inventario
            {stockBajoCount > 0 && (
              <span className={`${styles.navBadge} ${styles.navBadgeWarn}`}>{stockBajoCount} alertas</span>
            )}
          </button>
          <button className={styles.navItem} disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Reportes
            <span className={styles.comingSoon}>Próximamente</span>
          </button>
          <button className={styles.navItem} disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Usuarios
            <span className={styles.comingSoon}>Próximamente</span>
          </button>
        </nav>

        <div className={styles.sidebarEmisor}>
          <p className={styles.emisorLabel}>Emisor activo</p>
          <p className={styles.emisorNombre}>Baika Max Store</p>
          <p className={styles.emisorDetalle}>NIT: 0614-220180-101-9</p>
          <p className={styles.emisorDetalle}>NRC: 123456-7</p>
          <p className={styles.emisorDetalle}>Av. Olímpica, San Salvador</p>
        </div>

        <button className={styles.logoutBtn} onClick={() => setAutenticado(false)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* ── Tab: Facturación ── */}
        {tabActiva === 'facturacion' && (
          <div className={styles.tabContent}>
            <div className={styles.topbar}>
              <div>
                <h1 className={styles.pageTitle}>Facturación Electrónica DTE</h1>
                <p className={styles.pageSubtitle}>Transmisiones al Ministerio de Hacienda · DGII El Salvador</p>
              </div>
            </div>

            {/* KPIs */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Total emitidos</span>
                <span className={styles.kpiValue}>{facturasIniciales.length}</span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Procesados</span>
                <span className={`${styles.kpiValue} ${styles.kpiSuccess}`}>
                  {facturasIniciales.filter(f => f.estado === 'PROCESADO').length}
                </span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Pendientes</span>
                <span className={`${styles.kpiValue} ${styles.kpiWarning}`}>
                  {facturasIniciales.filter(f => f.estado === 'PENDIENTE').length}
                </span>
              </div>
              <div className={styles.kpi}>
                <span className={styles.kpiLabel}>Rechazados</span>
                <span className={`${styles.kpiValue} ${styles.kpiDanger}`}>
                  {facturasIniciales.filter(f => f.estado === 'RECHAZADO').length}
                </span>
              </div>
              <div className={`${styles.kpi} ${styles.kpiWide}`}>
                <span className={styles.kpiLabel}>Total facturado (procesados)</span>
                <span className={`${styles.kpiValue} ${styles.kpiAccent}`}>{fmt(totalProcesado)}</span>
              </div>
            </div>

            {/* Filtros */}
            <div className={styles.filtrosBar}>
              <select className={styles.select} value={filtroEstado} onChange={e => setFiltroEstado(e.target.value as EstadoDTE | 'TODOS')}>
                <option value="TODOS">Todos los estados</option>
                <option value="PROCESADO">Procesado</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="RECHAZADO">Rechazado</option>
                <option value="CONTINGENCIA">Contingencia</option>
              </select>
              <select className={styles.select} value={filtroTipo} onChange={e => setFiltroTipo(e.target.value as TipoDTE | 'TODOS')}>
                <option value="TODOS">Todos los tipos</option>
                <option value="01">Factura (01)</option>
                <option value="03">CCF (03)</option>
              </select>
              <span className={styles.resultCount}>{facturasFiltradas.length} resultado{facturasFiltradas.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Tabla DTEs */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nº Control</th>
                    <th>Tipo</th>
                    <th>Receptor</th>
                    <th>Fecha</th>
                    <th className={styles.txr}>Subtotal</th>
                    <th className={styles.txr}>IVA</th>
                    <th className={styles.txr}>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {facturasFiltradas.map(f => (
                    <tr key={f.dteId} className={seleccionado === f.dteId ? styles.rowSelected : ''}>
                      <td><code className={styles.code}>{f.numeroControl}</code></td>
                      <td>
                        <span className={`${styles.tipoBadge} ${f.tipoDTE === '03' ? styles.tipoCCF : styles.tipeFE}`}>
                          {LABEL_TIPO[f.tipoDTE]}
                        </span>
                      </td>
                      <td>
                        <p className={styles.receptorNombre}>{f.receptorNombre}</p>
                        <p className={styles.receptorDoc}>{f.receptorDUI}</p>
                      </td>
                      <td className={styles.fecha}>{fmtFecha(f.fechaEmision)}</td>
                      <td className={styles.txr}>{fmt(f.subtotal)}</td>
                      <td className={styles.txr}>{fmt(f.iva)}</td>
                      <td className={`${styles.txr} ${styles.totalCell}`}>{fmt(f.total)}</td>
                      <td>
                        <span className={`${styles.estadoBadge} ${styles[`estado${f.estado}`]}`}>
                          {LABEL_ESTADO[f.estado]}
                        </span>
                      </td>
                      <td>
                        <button className={styles.verBtn} onClick={() => setSeleccionado(prev => prev === f.dteId ? null : f.dteId)}>
                          {seleccionado === f.dteId ? 'Cerrar' : 'Detalle'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facturasFiltradas.length === 0 && <div className={styles.empty}>Sin resultados para los filtros seleccionados.</div>}
            </div>

            {/* Detalle DTE */}
            {dte && (
              <div className={styles.dteDetalle}>
                <div className={styles.dteDetalleHeader}>
                  <h3>Detalle DTE — <code>{dte.numeroControl}</code></h3>
                  <button onClick={() => setSeleccionado(null)} className={styles.cerrarDetalle}>✕</button>
                </div>
                <div className={styles.dteGrid}>
                  <div className={styles.dteField}><span className={styles.dteLabel}>Código de Generación</span><code className={styles.dteVal}>{dte.codigoGeneracion}</code></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>Sello de Recepción MH</span><code className={styles.dteVal}>{dte.selloRecepcion ?? '— Sin sello (no procesado)'}</code></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>Tipo DTE</span><span className={styles.dteVal}>{LABEL_TIPO[dte.tipoDTE]}</span></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>Estado DGII</span><span className={`${styles.estadoBadge} ${styles[`estado${dte.estado}`]}`}>{LABEL_ESTADO[dte.estado]}</span></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>NIT Emisor</span><span className={styles.dteVal}>{dte.emisorNIT}</span></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>NRC Emisor</span><span className={styles.dteVal}>{dte.emisorNRC}</span></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>Receptor</span><span className={styles.dteVal}>{dte.receptorNombre}</span></div>
                  <div className={styles.dteField}><span className={styles.dteLabel}>DUI / NIT Receptor</span><span className={styles.dteVal}>{dte.receptorDUI}</span></div>
                </div>
                <div className={styles.dteTotales}>
                  <div className={styles.dteTotalRow}><span>Subtotal sin IVA</span><span>{fmt(dte.subtotal)}</span></div>
                  <div className={styles.dteTotalRow}><span>IVA (13%)</span><span>{fmt(dte.iva)}</span></div>
                  <div className={`${styles.dteTotalRow} ${styles.dteTotalFinal}`}><span>Total</span><span className={styles.totalFinalAmt}>{fmt(dte.total)}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Inventario ── */}
        {tabActiva === 'inventario' && (
          <div className={styles.tabContent}>
            <div className={styles.topbar}>
              <div>
                <h1 className={styles.pageTitle}>Gestión de Inventario</h1>
                <p className={styles.pageSubtitle}>Productos del catálogo · Alertas de stock bajo · Cambios reflejados en tiempo real</p>
              </div>
              <button className={styles.btnNuevo} onClick={() => { handleCancelarForm(); setMostrarFormulario(true) }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nuevo Producto
              </button>
            </div>

            {/* Alertas stock bajo */}
            {stockBajoCount > 0 && (
              <div className={styles.alertaBanner}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <strong>{stockBajoCount} producto{stockBajoCount !== 1 ? 's' : ''} con stock bajo o agotado</strong>
                <span>— Filas resaltadas en la tabla de abajo</span>
              </div>
            )}

            {/* KPIs inventario */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpi}><span className={styles.kpiLabel}>Total productos</span><span className={styles.kpiValue}>{productos.length}</span></div>
              <div className={styles.kpi}><span className={styles.kpiLabel}>Activos</span><span className={`${styles.kpiValue} ${styles.kpiSuccess}`}>{productos.filter(p => p.activo).length}</span></div>
              <div className={styles.kpi}><span className={styles.kpiLabel}>Stock bajo</span><span className={`${styles.kpiValue} ${styles.kpiWarning}`}>{stockBajoCount}</span></div>
              <div className={styles.kpi}><span className={styles.kpiLabel}>Sin stock</span><span className={`${styles.kpiValue} ${styles.kpiDanger}`}>{productos.filter(p => p.stock === 0).length}</span></div>
            </div>

            {/* Buscador */}
            <div className={styles.invFiltros}>
              <div className={styles.searchWrapper}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text" className={styles.searchInput}
                  placeholder="Buscar producto, categoría, código…"
                  value={busquedaInv}
                  onChange={e => setBusquedaInv(e.target.value)}
                />
              </div>
              <span className={styles.resultCount}>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Tabla inventario */}
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th className={styles.txr}>Precio (s/IVA)</th>
                    <th className={styles.txr}>Stock</th>
                    <th className={styles.txr}>Umbral mín.</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map(p => {
                    const esStockBajo = p.stock <= p.umbralMinimo && p.activo
                    const esSinStock  = p.stock === 0
                    return (
                      <tr
                        key={p.productoId}
                        className={`${esSinStock ? styles.rowSinStock : esStockBajo ? styles.rowStockBajo : ''}`}
                      >
                        <td>
                          <div className={styles.prodCell}>
                            <img src={p.imagen} alt={p.nombre} className={styles.prodThumb}
                              onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=40&q=60' }} />
                            <div>
                              <p className={styles.prodNombre}>{p.nombre}</p>
                              <code className={styles.prodSku}>{p.numeroProducto}</code>
                            </div>
                          </div>
                        </td>
                        <td><span className={styles.catBadge}>{p.categoria}</span></td>
                        <td className={styles.txr}>{fmt(p.precio)}</td>
                        <td className={styles.txr}>
                          <span className={`${styles.stockNum} ${esSinStock ? styles.stockCrit : esStockBajo ? styles.stockWarn : styles.stockOk}`}>
                            {esSinStock && '⚠ '}{esStockBajo && !esSinStock && '⚡ '}{p.stock}
                          </span>
                        </td>
                        <td className={styles.txr}>{p.umbralMinimo}</td>
                        <td>
                          <button
                            className={`${styles.activoToggle} ${p.activo ? styles.activoOn : styles.activoOff}`}
                            onClick={() => handleToggleActivo(p.productoId)}
                          >
                            {p.activo ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td>
                          <div className={styles.acciones}>
                            <button className={styles.editBtn} onClick={() => handleEditar(p)} title="Editar">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button className={styles.delBtn} onClick={() => handleEliminar(p.productoId)} title="Eliminar">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Formulario crear/editar */}
            {mostrarFormulario && (
              <div className={styles.formOverlay} onClick={e => e.target === e.currentTarget && handleCancelarForm()}>
                <div className={styles.formModal}>
                  <div className={styles.formHeader}>
                    <h3>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <button className={styles.cerrarDetalle} onClick={handleCancelarForm}>✕</button>
                  </div>

                  <div className={styles.formGrid}>
                    <label className={styles.formLabel}>
                      Nombre del producto <span className={styles.required}>*</span>
                      <input type="text" className={styles.formInput} value={form.nombre}
                        onChange={e => handleFormChange('nombre', e.target.value)}
                        placeholder="Mountain-200 Black, 42" />
                    </label>
                    <label className={styles.formLabel}>
                      Número de producto (SKU) <span className={styles.required}>*</span>
                      <input type="text" className={styles.formInput} value={form.numeroProducto}
                        onChange={e => handleFormChange('numeroProducto', e.target.value)}
                        placeholder="BK-M18B-42" />
                    </label>
                    <label className={styles.formLabel}>
                      Categoría
                      <select className={styles.formInput} value={form.categoria}
                        onChange={e => handleFormChange('categoria', e.target.value)}>
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                    <label className={styles.formLabel}>
                      Precio sin IVA ($) <span className={styles.required}>*</span>
                      <input type="number" min="0" step="0.01" className={styles.formInput}
                        value={form.precio || ''}
                        onChange={e => handleFormChange('precio', parseFloat(e.target.value) || 0)}
                        placeholder="2294.99" />
                    </label>
                    <label className={styles.formLabel}>
                      Stock inicial
                      <input type="number" min="0" className={styles.formInput} value={form.stock || ''}
                        onChange={e => handleFormChange('stock', parseInt(e.target.value) || 0)}
                        placeholder="20" />
                    </label>
                    <label className={styles.formLabel}>
                      Umbral mínimo de alerta
                      <input type="number" min="0" className={styles.formInput} value={form.umbralMinimo || ''}
                        onChange={e => handleFormChange('umbralMinimo', parseInt(e.target.value) || 0)}
                        placeholder="5" />
                    </label>
                    <label className={`${styles.formLabel} ${styles.formFull}`}>
                      URL de imagen
                      <input type="url" className={styles.formInput} value={form.imagen}
                        onChange={e => handleFormChange('imagen', e.target.value)}
                        placeholder="https://images.unsplash.com/…" />
                    </label>
                    <label className={`${styles.formLabel} ${styles.formFull}`}>
                      Descripción
                      <textarea className={`${styles.formInput} ${styles.formTextarea}`}
                        value={form.descripcion}
                        onChange={e => handleFormChange('descripcion', e.target.value)}
                        placeholder="Descripción técnica del producto…"
                        rows={3} />
                    </label>
                  </div>

                  {formError && <div className={styles.formError}>⚠ {formError}</div>}

                  <div className={styles.formActions}>
                    <button className={styles.cancelBtn} onClick={handleCancelarForm}>Cancelar</button>
                    <button className={styles.saveBtn} onClick={handleGuardarProducto}>
                      {editandoId ? 'Guardar cambios' : 'Crear producto'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
