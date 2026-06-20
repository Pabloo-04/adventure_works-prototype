import type { Producto } from '../../types'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export function ProductCard({ producto, onAgregar }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={producto.imagen} alt={producto.nombre} className={styles.image} loading="lazy" />
        <span className={styles.categoria}>{producto.categoria}</span>
        {producto.stock <= 10 && (
          <span className={styles.lowStock}>Últimas {producto.stock} unidades</span>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.sku}>{producto.numeroProducto}</p>
        <h3 className={styles.nombre}>{producto.nombre}</h3>
        <p className={styles.descripcion}>{producto.descripcion}</p>

        <div className={styles.footer}>
          <div>
            <p className={styles.precioLabel}>Precio con IVA</p>
            <p className={styles.precio}>
              ${(producto.precio * 1.13).toFixed(2)}
            </p>
            <p className={styles.precioNeto}>
              ${producto.precio.toFixed(2)} neto
            </p>
          </div>

          <button
            className={styles.btnAgregar}
            onClick={() => onAgregar(producto)}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? 'Sin stock' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}
