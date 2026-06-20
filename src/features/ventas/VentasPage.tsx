import { useState } from 'react'
import { productos } from '../../data/productos'
import type { Producto } from '../../types'
import { ProductCard } from './ProductCard'
import styles from './VentasPage.module.css'

interface ItemCarrito {
  producto: Producto
  cantidad: number
}

const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))]

export function VentasPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  const productosFiltrados = categoriaActiva === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  function agregarAlCarrito(producto: Producto) {
    setCarrito(prev => {
      const existe = prev.find(i => i.producto.productoId === producto.productoId)
      if (existe) {
        return prev.map(i =>
          i.producto.productoId === producto.productoId
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }

  function quitarDelCarrito(productoId: string) {
    setCarrito(prev => prev.filter(i => i.producto.productoId !== productoId))
  }

  const subtotal = carrito.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0)

  function confirmarVenta() {
    setConfirmado(true)
    setCarrito([])
    setTimeout(() => {
      setConfirmado(false)
      setCarritoAbierto(false)
    }, 3000)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Catálogo de Productos</h1>
          <p className={styles.pageSubtitle}>
            Selección Adventure Works · Precios incluyen IVA 13%
          </p>

          <button
            className={styles.carritoBtn}
            onClick={() => setCarritoAbierto(o => !o)}
          >
            🛒 Carrito
            {totalItems > 0 && (
              <span className={styles.carritoCount}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      <div className={styles.container}>
        {/* Filtros */}
        <div className={styles.filtros}>
          {categorias.map(cat => (
            <button
              key={cat}
              className={`${styles.filtroBtn} ${categoriaActiva === cat ? styles.filtroActivo : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Grid de productos */}
          <section className={styles.grid}>
            {productosFiltrados.map(producto => (
              <ProductCard
                key={producto.productoId}
                producto={producto}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </section>

          {/* Carrito lateral */}
          {carritoAbierto && (
            <aside className={styles.carrito}>
              <div className={styles.carritoHeader}>
                <h2>Carrito</h2>
                <button onClick={() => setCarritoAbierto(false)} className={styles.cerrarBtn}>✕</button>
              </div>

              {confirmado && (
                <div className={styles.confirmado}>
                  ✅ Venta confirmada. Se generará el DTE correspondiente.
                </div>
              )}

              {carrito.length === 0 && !confirmado && (
                <p className={styles.carritoVacio}>No hay productos en el carrito.</p>
              )}

              {carrito.map(item => (
                <div key={item.producto.productoId} className={styles.carritoItem}>
                  <div className={styles.carritoItemInfo}>
                    <p className={styles.carritoItemNombre}>{item.producto.nombre}</p>
                    <p className={styles.carritoItemPrecio}>
                      {item.cantidad} × ${item.producto.precio.toFixed(2)}
                    </p>
                  </div>
                  <div className={styles.carritoItemRight}>
                    <span className={styles.carritoItemTotal}>
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </span>
                    <button
                      className={styles.quitarBtn}
                      onClick={() => quitarDelCarrito(item.producto.productoId)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {carrito.length > 0 && (
                <div className={styles.carritoResumen}>
                  <div className={styles.resumenFila}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className={styles.resumenFila}>
                    <span>IVA (13%)</span>
                    <span>${iva.toFixed(2)}</span>
                  </div>
                  <div className={`${styles.resumenFila} ${styles.resumenTotal}`}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button className={styles.confirmarBtn} onClick={confirmarVenta}>
                    Confirmar venta
                  </button>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
