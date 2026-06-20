import type { Producto } from '../../types'
import styles from './CarritoPanel.module.css'

export interface ItemCarrito {
  producto: Producto
  cantidad: number
}

interface CarritoPanelProps {
  items: ItemCarrito[]
  onCerrar: () => void
  onIncrementar: (productoId: string) => void
  onDecrementar: (productoId: string) => void
  onEliminar: (productoId: string) => void
  onVaciar: () => void
  onCheckout: () => void
}

function formatMoneda(n: number) {
  return `$${n.toFixed(2)}`
}

export function CarritoPanel({
  items,
  onCerrar,
  onIncrementar,
  onDecrementar,
  onEliminar,
  onVaciar,
  onCheckout,
}: CarritoPanelProps) {
  const subtotal = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva
  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.titulo}>Carrito</h2>
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>
          )}
        </div>
        <div className={styles.headerActions}>
          {items.length > 0 && (
            <button className={styles.vaciarBtn} onClick={onVaciar}>
              Vaciar
            </button>
          )}
          <button className={styles.cerrarBtn} onClick={onCerrar} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>
      </div>

      <div className={styles.items}>
        {items.length === 0 ? (
          <div className={styles.vacio}>
            <span className={styles.vacioIcon}>🛒</span>
            <p>Tu carrito está vacío.</p>
            <p className={styles.vacioHint}>Agrega productos desde el catálogo.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.producto.productoId} className={styles.item}>
              <img
                src={item.producto.imagen}
                alt={item.producto.nombre}
                className={styles.itemImg}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemNombre}>{item.producto.nombre}</p>
                <p className={styles.itemSku}>{item.producto.numeroProducto}</p>
                <p className={styles.itemPrecioUnit}>
                  {formatMoneda(item.producto.precio)} c/u
                </p>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.cantidad}>
                  <button
                    className={styles.cantBtn}
                    onClick={() => onDecrementar(item.producto.productoId)}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className={styles.cantNum}>{item.cantidad}</span>
                  <button
                    className={styles.cantBtn}
                    onClick={() => onIncrementar(item.producto.productoId)}
                    disabled={item.cantidad >= item.producto.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
                <p className={styles.itemTotal}>
                  {formatMoneda(item.producto.precio * item.cantidad)}
                </p>
                <button
                  className={styles.eliminarBtn}
                  onClick={() => onEliminar(item.producto.productoId)}
                  aria-label="Eliminar del carrito"
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.resumen}>
          <div className={styles.resumenFila}>
            <span>Subtotal (sin IVA)</span>
            <span>{formatMoneda(subtotal)}</span>
          </div>
          <div className={styles.resumenFila}>
            <span>IVA (13%)</span>
            <span>{formatMoneda(iva)}</span>
          </div>
          <div className={`${styles.resumenFila} ${styles.resumenTotal}`}>
            <span>Total</span>
            <span>{formatMoneda(total)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={onCheckout}>
            Proceder al pago →
          </button>
        </div>
      )}
    </aside>
  )
}
