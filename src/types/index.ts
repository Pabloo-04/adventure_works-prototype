export interface Producto {
  productoId: string
  nombre: string
  numeroProducto: string
  categoria: string
  precio: number
  stock: number
  imagen: string
  descripcion: string
  activo: boolean
}

export interface DetalleVenta {
  detalleId: string
  ventaId: string
  productoId: string
  nombreProducto: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Venta {
  ventaId: string
  fechaVenta: string
  usuarioId: string
  total: number
  estado: 'completada' | 'pendiente' | 'cancelada'
  detalles: DetalleVenta[]
}

export type TipoDTE = '01' | '03'
export type EstadoDTE = 'PROCESADO' | 'RECHAZADO' | 'PENDIENTE' | 'CONTINGENCIA'

export interface DTE {
  dteId: string
  ventaId: string
  tipoDTE: TipoDTE
  codigoGeneracion: string
  numeroControl: string
  selloRecepcion: string | null
  fechaEmision: string
  estado: EstadoDTE
  emisorNIT: string
  emisorNRC: string
  receptorNombre: string
  receptorDUI: string
  subtotal: number
  iva: number
  total: number
}
