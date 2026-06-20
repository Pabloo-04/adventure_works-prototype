import { useState } from 'react'
import { productos } from '../../data/productos'
import type { Producto } from '../../types'
import { ProductCard } from './ProductCard'
import { CarritoPanel, type ItemCarrito } from './CarritoPanel'
import { CheckoutModal, type DatosCliente } from './CheckoutModal'
import { OrdenConfirmada } from './OrdenConfirmada'
import styles from './VentasPage.module.css'

type Paso = 'catalogo' | 'checkout' | 'confirmado'

interface OrdenFinalizada {
  items: ItemCarrito[]
  datos: DatosCliente
  numeroControl: string
  codigoGeneracion: string
  fechaEmision: string
}

const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.categoria)))]

let contadorOrden = 50

function generarNumeroControl(tipoDTE: string) {
  contadorOrden++
  return `DTE-${tipoDTE}-M001P001-${String(contadorOrden).padStart(12, '0')}`
}

function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16).toUpperCase()
  })
}

export function VentasPage() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [paso, setPaso] = useState<Paso>('catalogo')
  const [orden, setOrden] = useState<OrdenFinalizada | null>(null)

  const productosFiltrados = categoriaActiva === 'Todas'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva)

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0)

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

  function incrementar(productoId: string) {
    setCarrito(prev => prev.map(i =>
      i.producto.productoId === productoId
        ? { ...i, cantidad: i.cantidad + 1 }
        : i
    ))
  }

  function decrementar(productoId: string) {
    setCarrito(prev => prev
      .map(i =>
        i.producto.productoId === productoId
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      )
      .filter(i => i.cantidad > 0)
    )
  }

  function eliminar(productoId: string) {
    setCarrito(prev => prev.filter(i => i.producto.productoId !== productoId))
  }

  function vaciar() {
    setCarrito([])
  }

  function confirmarCheckout(datos: DatosCliente) {
    const ahora = new Date().toISOString()
    setOrden({
      items: [...carrito],
      datos,
      numeroControl: generarNumeroControl(datos.tipoDTE),
      codigoGeneracion: generarUUID(),
      fechaEmision: ahora,
    })
    setCarrito([])
    setCarritoAbierto(false)
    setPaso('confirmado')
  }

  function nuevaCompra() {
    setOrden(null)
    setPaso('catalogo')
  }

  return (
    <div className={styles.page}>
      {/* Checkout modal */}
      {paso === 'checkout' && (
        <CheckoutModal
          items={carrito}
          onConfirmar={confirmarCheckout}
          onCancelar={() => setPaso('catalogo')}
        />
      )}

      {/* Confirmación / Recibo */}
      {paso === 'confirmado' && orden && (
        <OrdenConfirmada
          items={orden.items}
          datos={orden.datos}
          numeroControl={orden.numeroControl}
          codigoGeneracion={orden.codigoGeneracion}
          fechaEmision={orden.fechaEmision}
          onNuevaCompra={nuevaCompra}
        />
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <div>
            <h1 className={styles.pageTitle}>Catálogo de Productos</h1>
            <p className={styles.pageSubtitle}>
              Selección Adventure Works · Precios sin IVA · Se aplica 13% al total
            </p>
          </div>

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
            <CarritoPanel
              items={carrito}
              onCerrar={() => setCarritoAbierto(false)}
              onIncrementar={incrementar}
              onDecrementar={decrementar}
              onEliminar={eliminar}
              onVaciar={vaciar}
              onCheckout={() => setPaso('checkout')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
