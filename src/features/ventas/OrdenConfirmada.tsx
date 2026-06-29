import type { ItemCarrito, DatosCliente, TipoDTE } from '../../types'
import styles from './OrdenConfirmada.module.css'

interface OrdenConfirmadaProps {
  items: ItemCarrito[]
  datos: DatosCliente
  numeroControl: string
  codigoGeneracion: string
  selloRecepcion: string
  fechaEmision: string
  onNuevaCompra: () => void
}

const LABEL_TIPO: Record<TipoDTE, string> = {
  '01': 'Factura Electrónica',
  '03': 'Comprobante de Crédito Fiscal',
  '05': 'Nota de Crédito',
  '06': 'Nota de Remisión',
}

function fmt(n: number) { return `$${n.toFixed(2)}` }

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function OrdenConfirmada({
  items, datos, numeroControl, codigoGeneracion, selloRecepcion, fechaEmision, onNuevaCompra,
}: OrdenConfirmadaProps) {
  const subtotal = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva

  function handlePrint() { window.print() }

  return (
    <div className={styles.overlay}>
      <div className={styles.wrapper}>
        {/* Success bar */}
        <div className={styles.successBar}>
          <div className={styles.successBarLeft}>
            <div className={styles.successIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className={styles.successTitle}>DTE Emitido y Aceptado por Hacienda</p>
              <p className={styles.successSub}>Documento transmitido · Estado: PROCESADO</p>
            </div>
          </div>
          <div className={styles.successActions}>
            <button className={styles.printBtn} onClick={handlePrint}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Imprimir
            </button>
            <button className={styles.pdfBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF (simulado)
            </button>
          </div>
        </div>

        {/* DTE Document */}
        <div className={styles.dte} id="dte-print">
          {/* DTE Header */}
          <div className={styles.dteHeader}>
            <div className={styles.dteEmisor}>
              <div className={styles.emisorLogo}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
                  <path d="M5 17L10 7H14L19 17"/><path d="M12 7V4" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className={styles.emisorNombre}>BAIKA MAX STORE</p>
                <p className={styles.emisorDetalle}>Bicicletas y Accesorios Premium</p>
                <p className={styles.emisorDetalle}>Av. Olímpica Km 2, San Salvador, El Salvador</p>
                <p className={styles.emisorDetalle}>NIT: 0614-220180-101-9 · NRC: 123456-7</p>
                <p className={styles.emisorDetalle}>Tel: (+503) 2222-3333 · info@baikamax.sv</p>
              </div>
            </div>
            <div className={styles.dteTipo}>
              <div className={styles.tipoBadge}>
                <span className={styles.tipoCodigo}>{datos.tipoDTE}</span>
                <span className={styles.tipoNombre}>{LABEL_TIPO[datos.tipoDTE]}</span>
                <span className={styles.tipoSubLabel}>Documento Tributario Electrónico</span>
              </div>
            </div>
          </div>

          {/* Metadata grid */}
          <div className={styles.metaGrid}>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Número de Control</span>
              <code className={styles.metaVal}>{numeroControl}</code>
            </div>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Fecha de Emisión</span>
              <code className={styles.metaVal}>{fmtFecha(fechaEmision)}</code>
            </div>
            <div className={`${styles.metaField} ${styles.metaFull}`}>
              <span className={styles.metaLabel}>Código de Generación</span>
              <code className={styles.metaVal}>{codigoGeneracion}</code>
            </div>
            <div className={`${styles.metaField} ${styles.metaFull}`}>
              <span className={styles.metaLabel}>Sello de Recepción Ministerio de Hacienda</span>
              <div className={styles.selloWrapper}>
                <span className={styles.selloDot}>●</span>
                <code className={styles.selloVal}>{selloRecepcion}</code>
                <span className={styles.estadoBadge}>PROCESADO</span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Receptor */}
          <div className={styles.receptorSection}>
            <p className={styles.sectionLabel}>Datos del Receptor</p>
            <div className={styles.receptorGrid}>
              <div>
                <span className={styles.metaLabel}>Nombre / Razón Social</span>
                <p className={styles.receptorVal}>{datos.nombre}</p>
              </div>
              <div>
                <span className={styles.metaLabel}>{datos.tipoDTE === '03' ? 'NIT' : 'DUI'}</span>
                <p className={styles.receptorVal}>{datos.documento}</p>
              </div>
              {datos.nrc && (
                <div>
                  <span className={styles.metaLabel}>NRC</span>
                  <p className={styles.receptorVal}>{datos.nrc}</p>
                </div>
              )}
              {datos.actividadEconomica && (
                <div>
                  <span className={styles.metaLabel}>Actividad Económica</span>
                  <p className={styles.receptorVal}>{datos.actividadEconomica}</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.divider} />

          {/* Items table */}
          <p className={styles.sectionLabel}>Detalle de Productos</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th className={styles.txr}>Cant.</th>
                <th className={styles.txr}>P. Unitario</th>
                <th className={styles.txr}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.producto.productoId}>
                  <td><code className={styles.skuCode}>{item.producto.numeroProducto}</code></td>
                  <td>
                    <p className={styles.prodNombre}>{item.producto.nombre}</p>
                    <p className={styles.prodCat}>{item.producto.categoria}</p>
                  </td>
                  <td className={styles.txr}>{item.cantidad}</td>
                  <td className={styles.txr}>{fmt(item.producto.precio)}</td>
                  <td className={`${styles.txr} ${styles.subtotalCell}`}>{fmt(item.producto.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className={styles.totales}>
            <div className={styles.totalRow}><span>Subtotal gravado (sin IVA)</span><span>{fmt(subtotal)}</span></div>
            <div className={styles.totalRow}><span>IVA (13%)</span><span>{fmt(iva)}</span></div>
            <div className={`${styles.totalRow} ${styles.totalFinal}`}>
              <span>TOTAL A PAGAR</span>
              <span className={styles.totalAmount}>{fmt(total)}</span>
            </div>
          </div>

          <p className={styles.pieDoc}>
            Documento Tributario Electrónico emitido bajo el Artículo 107 del Código Tributario de El Salvador.
            Este documento es válido sin firma física. Verificar en <strong>factura.gob.sv</strong> con el Código de Generación.
          </p>
        </div>

        <div className={styles.bottomActions}>
          <button className={styles.nuevaCompraBtn} onClick={onNuevaCompra}>
            ← Realizar otra compra
          </button>
        </div>
      </div>
    </div>
  )
}
