import { useState, useEffect } from 'react'
import type { ItemCarrito, DatosCliente, TipoDTE } from '../../types'
import styles from './CheckoutModal.module.css'

interface CheckoutModalProps {
  items: ItemCarrito[]
  onConfirmar: (datos: DatosCliente, sello: string, uuid: string) => void
  onCancelar: () => void
}

type Paso = 'datos' | 'procesando' | 'exito'

const TIPOS: { key: TipoDTE; nombre: string; desc: string; secondary?: boolean }[] = [
  { key: '01', nombre: 'Factura',           desc: 'Consumidor final · DUI' },
  { key: '03', nombre: 'Crédito Fiscal',    desc: 'Contribuyente · NIT + NRC' },
  { key: '05', nombre: 'Nota de Crédito',   desc: 'Corrección / ajuste', secondary: true },
  { key: '06', nombre: 'Nota de Remisión',  desc: 'Traslado de mercancía', secondary: true },
]

const PROGRESS_MSGS = [
  { msg: 'Validando datos del receptor…',                                          pct: 20 },
  { msg: 'Firmando documento digitalmente con certificado DGII…',                  pct: 45 },
  { msg: 'Transmitiendo a API del Ministerio de Hacienda (factura.gob.sv)…',       pct: 70 },
  { msg: 'Procesando respuesta del Ministerio de Hacienda…',                       pct: 90 },
  { msg: 'Sello de recepción recibido. Documento PROCESADO.',                      pct: 100 },
]

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16).toUpperCase()
  })
}

function generarSello() {
  const hex = Array.from({ length: 38 }, () => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('')
  return `SH${new Date().getFullYear()}-${hex}`
}

function fmt(n: number) { return `$${n.toFixed(2)}` }

export function CheckoutModal({ items, onConfirmar, onCancelar }: CheckoutModalProps) {
  const [paso, setPaso] = useState<Paso>('datos')
  const [tipoDTE, setTipoDTE] = useState<TipoDTE>('01')
  const [nombre, setNombre] = useState('')
  const [documento, setDocumento] = useState('')
  const [nrc, setNrc] = useState('')
  const [actividad, setActividad] = useState('')
  const [error, setError] = useState('')
  const [progressIdx, setProgressIdx] = useState(0)
  const [sello, setSello] = useState('')
  const [uuid, setUuid] = useState('')

  const subtotal = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva

  useEffect(() => {
    if (paso !== 'procesando') return
    let idx = 0
    const iv = setInterval(() => {
      idx++
      setProgressIdx(idx)
      if (idx >= PROGRESS_MSGS.length - 1) {
        clearInterval(iv)
        setTimeout(() => {
          setSello(generarSello())
          setUuid(generarUUID())
          setPaso('exito')
        }, 600)
      }
    }, 650)
    return () => clearInterval(iv)
  }, [paso])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) { setError('El nombre del cliente es requerido.'); return }
    if (!documento.trim()) { setError('El número de documento es requerido.'); return }
    if (tipoDTE === '01') {
      if (!/^\d{8}-\d$/.test(documento.trim())) {
        setError('DUI inválido. Formato esperado: 04589723-4'); return
      }
    }
    if (tipoDTE === '03') {
      if (!/^\d{4}-\d{6}-\d{3}-\d$/.test(documento.trim())) {
        setError('NIT inválido. Formato esperado: 0614-010190-102-3'); return
      }
      if (!nrc.trim()) { setError('El NRC es requerido para Crédito Fiscal.'); return }
    }
    setProgressIdx(0)
    setPaso('procesando')
  }

  function handleVerRecibo() {
    onConfirmar(
      { nombre: nombre.trim(), documento: documento.trim(), tipoDTE, nrc: nrc.trim() || undefined, actividadEconomica: actividad.trim() || undefined },
      sello,
      uuid,
    )
  }

  const current = PROGRESS_MSGS[Math.min(progressIdx, PROGRESS_MSGS.length - 1)]

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && paso === 'datos' && onCancelar()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <span className={`${styles.stepPill} ${paso === 'exito' ? styles.stepPillSuccess : ''}`}>
              {paso === 'datos' && 'Paso 1 · Datos del receptor'}
              {paso === 'procesando' && 'Paso 2 · Transmisión al MH'}
              {paso === 'exito' && '✓ Documento procesado por Hacienda'}
            </span>
            <h2 className={styles.modalTitle}>
              {paso === 'datos' && 'Facturación Electrónica DTE'}
              {paso === 'procesando' && 'Transmitiendo al Ministerio de Hacienda…'}
              {paso === 'exito' && '¡DTE Emitido con Éxito!'}
            </h2>
          </div>
          {paso === 'datos' && (
            <button className={styles.cerrarBtn} onClick={onCancelar} aria-label="Cerrar">✕</button>
          )}
        </div>

        {/* ── Paso 1: datos ── */}
        {paso === 'datos' && (
          <div className={styles.body}>
            <div className={styles.resumenCompra}>
              <p className={styles.resumenLabel}>Resumen de compra</p>
              <div className={styles.resumenItems}>
                {items.map(i => (
                  <div key={i.producto.productoId} className={styles.resumenItem}>
                    <span>{i.cantidad}× {i.producto.nombre}</span>
                    <span>{fmt(i.producto.precio * i.cantidad)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.resumenTotales}>
                <div className={styles.resumenRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className={styles.resumenRow}><span>IVA 13%</span><span>{fmt(iva)}</span></div>
                <div className={`${styles.resumenRow} ${styles.resumenFinal}`}><span>Total</span><strong>{fmt(total)}</strong></div>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.dteSection}>
                <p className={styles.groupLabel}>Tipo de Documento Tributario Electrónico</p>
                <div className={styles.tabsGrid}>
                  {TIPOS.map(t => (
                    <button
                      key={t.key}
                      type="button"
                      className={`${styles.dteTab} ${tipoDTE === t.key ? styles.dteTabActive : ''} ${t.secondary ? styles.dteTabSecondary : ''}`}
                      onClick={() => { setTipoDTE(t.key); setDocumento(''); setError('') }}
                    >
                      <span className={styles.tabCod}>{t.key}</span>
                      <span className={styles.tabNombre}>{t.nombre}</span>
                      <span className={styles.tabDesc}>{t.desc}</span>
                    </button>
                  ))}
                </div>
                {(tipoDTE === '05' || tipoDTE === '06') && (
                  <div className={styles.infoBox}>
                    <span>ℹ</span>
                    {tipoDTE === '05' && 'Nota de Crédito (05): para ajustes o correcciones a documentos emitidos previamente.'}
                    {tipoDTE === '06' && 'Nota de Remisión (06): para traslado de mercancía sin cargo. Requiere factura de referencia.'}
                  </div>
                )}
              </div>

              <div className={styles.fields}>
                <label className={styles.label}>
                  {tipoDTE === '03' ? 'Razón Social / Empresa' : 'Nombre del Cliente'}
                  <input
                    type="text" className={styles.input}
                    placeholder={tipoDTE === '03' ? 'Deportes Rivera S.A. de C.V.' : 'Carlos Alberto Martínez López'}
                    value={nombre} onChange={e => setNombre(e.target.value)} required
                  />
                </label>
                <label className={styles.label}>
                  {tipoDTE === '03' ? 'NIT de la empresa' : 'DUI del cliente'}
                  <input
                    type="text" className={styles.input}
                    placeholder={tipoDTE === '03' ? '0614-010190-102-3' : '04589723-4'}
                    value={documento} onChange={e => setDocumento(e.target.value)} required
                  />
                  <span className={styles.hint}>
                    {tipoDTE === '03' ? 'Formato NIT: XXXX-XXXXXX-XXX-X' : 'Formato DUI: XXXXXXXX-X'}
                  </span>
                </label>
                {tipoDTE === '03' && (
                  <>
                    <label className={styles.label}>
                      NRC <span className={styles.required}>*</span>
                      <input type="text" className={styles.input} placeholder="123456-7" value={nrc} onChange={e => setNrc(e.target.value)} />
                    </label>
                    <label className={styles.label}>
                      Actividad Económica <span className={styles.optional}>(opcional)</span>
                      <input type="text" className={styles.input}
                        placeholder="Venta al por menor de artículos deportivos"
                        value={actividad} onChange={e => setActividad(e.target.value)} />
                    </label>
                  </>
                )}
              </div>

              {error && <div className={styles.errorBox}><span>⚠</span> {error}</div>}

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={onCancelar}>← Volver al carrito</button>
                <button type="submit" className={styles.submitBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Emitir DTE
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Paso 2: procesando ── */}
        {paso === 'procesando' && (
          <div className={styles.procesando}>
            <div className={styles.spinnerRing}>
              <div className={styles.spinnerOuter} />
              <div className={styles.spinnerInner} />
              <span className={styles.spinnerIcon}>🧾</span>
            </div>
            <p className={styles.procesandoMsg}>{current.msg}</p>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${current.pct}%` }} />
            </div>
            <p className={styles.pct}>{current.pct}% completado</p>
            <div className={styles.log}>
              {PROGRESS_MSGS.slice(0, progressIdx + 1).map((m, i) => (
                <div key={i} className={`${styles.logLine} ${i < progressIdx ? styles.logDone : styles.logActive}`}>
                  <span className={styles.logBullet}>{i < progressIdx ? '✓' : '●'}</span>
                  <span>{m.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Paso 3: éxito ── */}
        {paso === 'exito' && (
          <div className={styles.exito}>
            <div className={styles.exitoBanner}>
              <div className={styles.exitoCheck}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className={styles.exitoTitle}>Documento Tributario Emitido y Aceptado</p>
                <p className={styles.exitoSub}>Ministerio de Hacienda · DGII El Salvador</p>
              </div>
            </div>

            <div className={styles.exitoGrid}>
              <div className={styles.exitoField}>
                <span className={styles.exitoLabel}>Estado DGII</span>
                <span className={styles.estadoBadge}>● PROCESADO</span>
              </div>
              <div className={styles.exitoField}>
                <span className={styles.exitoLabel}>Tipo DTE</span>
                <span className={styles.exitoVal}>{tipoDTE} · {TIPOS.find(t => t.key === tipoDTE)?.nombre}</span>
              </div>
              <div className={`${styles.exitoField} ${styles.full}`}>
                <span className={styles.exitoLabel}>Sello de Recepción MH</span>
                <code className={styles.sello}>{sello}</code>
              </div>
              <div className={`${styles.exitoField} ${styles.full}`}>
                <span className={styles.exitoLabel}>Código de Generación UUID</span>
                <code className={styles.uuid}>{uuid}</code>
              </div>
              <div className={styles.exitoField}>
                <span className={styles.exitoLabel}>Receptor</span>
                <span className={styles.exitoVal}>{nombre}</span>
              </div>
              <div className={styles.exitoField}>
                <span className={styles.exitoLabel}>Total a Pagar</span>
                <span className={styles.exitoTotal}>{fmt(total)}</span>
              </div>
            </div>

            <button className={styles.verReciboBtn} onClick={handleVerRecibo}>
              Ver representación gráfica del DTE
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
