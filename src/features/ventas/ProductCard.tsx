import type { Producto } from '../../types'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export function ProductCard({ producto, onAgregar }: ProductCardProps) {
  const precioConIva = producto.precio * 1.13
  const stockBajo = producto.stock > 0 && producto.stock <= producto.umbralMinimo
  const sinStock = producto.stock === 0

  return (
    <article className={`${styles.card} ${sinStock ? styles.cardDisabled : ''}`}>
      <div className={styles.imageWrapper}>
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className={styles.image}
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&q=60' }}
        />
        <span className={styles.categoria}>{producto.categoria}</span>
        {stockBajo && !sinStock && (
          <span className={styles.stockBajo}>
            ⚠ Solo {producto.stock} en stock
          </span>
        )}
        {sinStock && <span className={styles.sinStock}>Sin stock</span>}
      </div>

      <div className={styles.body}>
        <p className={styles.sku}>{producto.numeroProducto}</p>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.descripcion}>{producto.descripcion}</p>

        <div className={styles.footer}>
          <div className={styles.precios}>
            <p className={styles.precioConIva}>${precioConIva.toFixed(2)}</p>
            <p className={styles.precioNeto}>${producto.precio.toFixed(2)} s/IVA</p>
          </div>
          <button
            className={styles.btnAgregar}
            onClick={() => onAgregar(producto)}
            disabled={sinStock}
          >
            {sinStock ? 'Sin stock' : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
