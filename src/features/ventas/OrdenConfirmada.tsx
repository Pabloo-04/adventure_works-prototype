import type { ItemCarrito } from './CarritoPanel'
import type { DatosCliente } from './CheckoutModal'
import type { TipoDTE } from '../../types'
import styles from './OrdenConfirmada.module.css'

interface OrdenConfirmadaProps {
  items: ItemCarrito[]
  datos: DatosCliente
  numeroControl: string
  codigoGeneracion: string
  fechaEmision: string
  onNuevaCompra: () => void
}

const LABEL_TIPO: Record<TipoDTE, string> = {
  '01': 'Factura Electrónica (01)',
  '03': 'Comprobante de Crédito Fiscal (03)',
}

function formatMoneda(n: number) {
  return `$${n.toFixed(2)}`
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-SV', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function OrdenConfirmada({
  items,
  datos,
  numeroControl,
  codigoGeneracion,
  fechaEmision,
  onNuevaCompra,
}: OrdenConfirmadaProps) {
  const subtotal = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Encabezado confirmación */}
        <div className={styles.successBanner}>
          <span className={styles.successIcon}>✓</span>
          <div>
            <h2 className={styles.successTitle}>¡Venta confirmada!</h2>
            <p className={styles.successSubtitle}>
              DTE emitido y transmitido al Ministerio de Hacienda
            </p>
          </div>
        </div>

        {/* Recibo */}
        <div className={styles.recibo}>
          <div className={styles.reciboHeader}>
            <div>
              <p className={styles.reciboEmisor}>Baika Max Store</p>
              <p className={styles.reciboEmisorDetalle}>NIT: 0614-220180-101-9 · NRC: 123456-7</p>
              <p className={styles.reciboEmisorDetalle}>Av. Olímpica, San Salvador, El Salvador</p>
            </div>
            <div className={styles.reciboTipoBadge}>
              <span className={styles.tipoCodigo}>{datos.tipoDTE}</span>
              <span className={styles.tipoNombre}>{LABEL_TIPO[datos.tipoDTE]}</span>
            </div>
          </div>

          <div className={styles.reciboMeta}>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Número de Control</span>
              <code className={styles.metaValue}>{numeroControl}</code>
            </div>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Código de Generación</span>
              <code className={styles.metaValueSmall}>{codigoGeneracion}</code>
            </div>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Sello de Recepción MH</span>
              <div className={styles.selloBadge}>
                <span className={styles.selloIndicador}>●</span> PROCESADO
              </div>
            </div>
            <div className={styles.metaField}>
              <span className={styles.metaLabel}>Fecha de Emisión</span>
              <code className={styles.metaValue}>{formatFecha(fechaEmision)}</code>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.receptor}>
            <p className={styles.receptorLabel}>Receptor</p>
            <p className={styles.receptorNombre}>{datos.nombre}</p>
            <p className={styles.receptorDoc}>
              {datos.tipoDTE === '01' ? 'DUI' : 'NIT'}: {datos.documento}
            </p>
          </div>

          <div className={styles.divider} />

          {/* Detalle de productos */}
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Descripción</th>
                <th className={styles.textRight}>Cant.</th>
                <th className={styles.textRight}>P. Unit.</th>
                <th className={styles.textRight}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.producto.productoId}>
                  <td>
                    <p className={styles.productoNombre}>{item.producto.nombre}</p>
                    <p className={styles.productoSku}>{item.producto.numeroProducto}</p>
                  </td>
                  <td className={styles.textRight}>{item.cantidad}</td>
                  <td className={styles.textRight}>{formatMoneda(item.producto.precio)}</td>
                  <td className={styles.textRight}>{formatMoneda(item.producto.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.totales}>
            <div className={styles.totalFila}>
              <span>Subtotal gravado</span>
              <span>{formatMoneda(subtotal)}</span>
            </div>
            <div className={styles.totalFila}>
              <span>IVA (13%)</span>
              <span>{formatMoneda(iva)}</span>
            </div>
            <div className={`${styles.totalFila} ${styles.totalFilaFinal}`}>
              <span>TOTAL A PAGAR</span>
              <span>{formatMoneda(total)}</span>
            </div>
          </div>

          <p className={styles.pie}>
            Documento tributario electrónico emitido bajo el Artículo 107 del Código Tributario
            de El Salvador. Número de autorización DGII: SH2024-{codigoGeneracion.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <button className={styles.nuevaCompraBtn} onClick={onNuevaCompra}>
          ← Realizar otra compra
        </button>
      </div>
    </div>
  )
}
