import { useState } from 'react'
import type { Producto, ItemCarrito, DatosCliente } from '../../types'
import { productosIniciales } from '../../data/productos'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { ProductCard } from './ProductCard'
import { CarritoPanel } from './CarritoPanel'
import { CheckoutModal } from './CheckoutModal'
import { OrdenConfirmada } from './OrdenConfirmada'
import styles from './VentasPage.module.css'

interface ToastMsg { id: string; message: string; type: 'warning' | 'success' }

type Paso = 'catalogo' | 'checkout' | 'confirmado'

interface OrdenFinalizada {
  items: ItemCarrito[]
  datos: DatosCliente
  sello: string
  numeroControl: string
  codigoGeneracion: string
  fechaEmision: string
}

const CATEGORIAS_BASE = ['Todas', 'Mountain Bikes', 'Road Bikes', 'Touring Bikes', 'Helmets', 'Accesorios']

let contadorOrden = 50
function genControl(tipo: string) {
  contadorOrden++
  return `DTE-${tipo}-M001P001-${String(contadorOrden).padStart(12, '0')}`
}

export function VentasPage() {
  const [productos] = useLocalStorage<Producto[]>('baika_productos', productosIniciales)

  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [paso, setPaso] = useState<Paso>('catalogo')
  const [orden, setOrden] = useState<OrdenFinalizada | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [toasts, setToasts] = useState<ToastMsg[]>([])

  function addToast(message: string, type: ToastMsg['type'] = 'warning') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800)
  }

  const categorias = CATEGORIAS_BASE.filter(
    cat => cat === 'Todas' || productos.some(p => p.categoria === cat)
  )

  const productosFiltrados = productos
    .filter(p => p.activo)
    .filter(p => categoriaActiva === 'Todas' || p.categoria === categoriaActiva)
    .filter(p =>
      !busqueda.trim() ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
    )

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0)

  function agregarAlCarrito(producto: Producto) {
    const enCarrito = carrito.find(i => i.producto.productoId === producto.productoId)
    const cantActual = enCarrito?.cantidad ?? 0
    if (cantActual >= producto.stock) {
      addToast(`Stock insuficiente: solo quedan ${producto.stock} unidades de "${producto.nombre}"`, 'warning')
      return
    }
    setCarrito(prev => {
      if (enCarrito) {
        return prev.map(i =>
          i.producto.productoId === producto.productoId ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { producto, cantidad: 1 }]
    })
    setCarritoAbierto(true)
  }

  function incrementar(productoId: string) {
    const item = carrito.find(i => i.producto.productoId === productoId)
    if (item && item.cantidad >= item.producto.stock) {
      addToast(`Stock insuficiente: solo hay ${item.producto.stock} unidades disponibles`, 'warning')
      return
    }
    setCarrito(prev => prev.map(i =>
      i.producto.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
    ))
  }

  function decrementar(productoId: string) {
    setCarrito(prev => prev
      .map(i => i.producto.productoId === productoId ? { ...i, cantidad: i.cantidad - 1 } : i)
      .filter(i => i.cantidad > 0)
    )
  }

  function eliminar(productoId: string) {
    setCarrito(prev => prev.filter(i => i.producto.productoId !== productoId))
  }

  function vaciar() { setCarrito([]) }

  function confirmarCheckout(datos: DatosCliente, sello: string, uuid: string) {
    setOrden({
      items: [...carrito],
      datos,
      sello,
      numeroControl: genControl(datos.tipoDTE),
      codigoGeneracion: uuid,
      fechaEmision: new Date().toISOString(),
    })
    setCarrito([])
    setCarritoAbierto(false)
    setPaso('confirmado')
  }

  function nuevaCompra() { setOrden(null); setPaso('catalogo') }

  if (paso === 'confirmado' && orden) {
    return (
      <OrdenConfirmada
        items={orden.items}
        datos={orden.datos}
        numeroControl={orden.numeroControl}
        codigoGeneracion={orden.codigoGeneracion}
        selloRecepcion={orden.sello}
        fechaEmision={orden.fechaEmision}
        onNuevaCompra={nuevaCompra}
      />
    )
  }

  return (
    <div className={styles.page}>
      {/* Toast notifications */}
      <div className={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} className={`${styles.toast} ${styles[`toast_${t.type}`]}`}>
            <span>{t.type === 'warning' ? '⚠' : '✓'}</span>
            <span>{t.message}</span>
            <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}>✕</button>
          </div>
        ))}
      </div>

      {/* Checkout modal */}
      {paso === 'checkout' && (
        <CheckoutModal
          items={carrito}
          onConfirmar={confirmarCheckout}
          onCancelar={() => setPaso('catalogo')}
        />
      )}

      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.pageTitle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ display: 'inline', marginRight: 10, verticalAlign: 'middle' }}>
                <circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/>
                <path d="M5 17L10 7H14L19 17"/><path d="M12 7V4" strokeLinecap="round"/>
              </svg>
              Catálogo Baika Max
            </h1>
            <p className={styles.pageSubtitle}>Bicicletas y accesorios premium · Precios incluyen IVA 13%</p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.searchWrapper}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar bicis, accesorios…"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>

            <button className={styles.carritoBtn} onClick={() => setCarritoAbierto(o => !o)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Carrito
              {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
            </button>
          </div>
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
          <span className={styles.resultCount}>{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}</span>
        </div>

        <div className={styles.layout}>
          {/* Grid */}
          {productosFiltrados.length > 0 ? (
            <section className={styles.grid}>
              {productosFiltrados.map(p => (
                <ProductCard key={p.productoId} producto={p} onAgregar={agregarAlCarrito} />
              ))}
            </section>
          ) : (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No se encontraron productos para <strong>"{busqueda}"</strong></p>
              <button onClick={() => { setBusqueda(''); setCategoriaActiva('Todas') }} className={styles.resetBtn}>
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Carrito */}
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
