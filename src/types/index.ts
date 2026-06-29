export interface Producto {
  productoId: string
  nombre: string
  numeroProducto: string
  categoria: string
  precio: number
  stock: number
  umbralMinimo: number
  imagen: string
  descripcion: string
  activo: boolean
}

export interface ItemCarrito {
  producto: Producto
  cantidad: number
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

export type TipoDTE = '01' | '03' | '05' | '06'
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

export interface DatosCliente {
  nombre: string
  documento: string
  tipoDTE: TipoDTE
  nrc?: string
  actividadEconomica?: string
}
