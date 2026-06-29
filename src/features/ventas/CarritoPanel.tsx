import type { ItemCarrito } from '../../types'
import styles from './CarritoPanel.module.css'

interface CarritoPanelProps {
  items: ItemCarrito[]
  onCerrar: () => void
  onIncrementar: (productoId: string) => void
  onDecrementar: (productoId: string) => void
  onEliminar: (productoId: string) => void
  onVaciar: () => void
  onCheckout: () => void
}

function fmt(n: number) { return `$${n.toFixed(2)}` }

export function CarritoPanel({
  items, onCerrar, onIncrementar, onDecrementar, onEliminar, onVaciar, onCheckout,
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
            <button className={styles.vaciarBtn} onClick={onVaciar}>Vaciar</button>
          )}
          <button className={styles.cerrarBtn} onClick={onCerrar} aria-label="Cerrar carrito">✕</button>
        </div>
      </div>

      <div className={styles.items}>
        {items.length === 0 ? (
          <div className={styles.vacio}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={styles.vacioIcon}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p className={styles.vacioTitulo}>Tu carrito está vacío</p>
            <p className={styles.vacioHint}>Agrega bicicletas y accesorios desde el catálogo</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.producto.productoId} className={styles.item}>
              <img src={item.producto.imagen} alt={item.producto.nombre} className={styles.itemImg}
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=80&q=60' }} />
              <div className={styles.itemInfo}>
                <p className={styles.itemNombre}>{item.producto.nombre}</p>
                <p className={styles.itemSku}>{item.producto.numeroProducto}</p>
                <p className={styles.itemPrecio}>{fmt(item.producto.precio)} c/u</p>
              </div>
              <div className={styles.itemRight}>
                <div className={styles.cantidad}>
                  <button className={styles.cantBtn} onClick={() => onDecrementar(item.producto.productoId)} aria-label="Menos">−</button>
                  <span className={styles.cantNum}>{item.cantidad}</span>
                  <button
                    className={styles.cantBtn}
                    onClick={() => onIncrementar(item.producto.productoId)}
                    disabled={item.cantidad >= item.producto.stock}
                    aria-label="Más"
                  >+</button>
                </div>
                <p className={styles.itemTotal}>{fmt(item.producto.precio * item.cantidad)}</p>
                <button className={styles.eliminarBtn} onClick={() => onEliminar(item.producto.productoId)} aria-label="Eliminar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className={styles.resumen}>
          <div className={styles.resumenRow}>
            <span>Subtotal (sin IVA)</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className={styles.resumenRow}>
            <span>IVA (13%)</span>
            <span>{fmt(iva)}</span>
          </div>
          <div className={`${styles.resumenRow} ${styles.resumenTotal}`}>
            <span>Total</span>
            <span className={styles.totalAmount}>{fmt(total)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={onCheckout}>
            Proceder a Facturación
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      )}
    </aside>
  )
}
