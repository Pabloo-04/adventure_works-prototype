import { useState } from 'react'
import type { ItemCarrito } from './CarritoPanel'
import type { TipoDTE } from '../../types'
import styles from './CheckoutModal.module.css'

export interface DatosCliente {
  nombre: string
  documento: string
  tipoDTE: TipoDTE
}

interface CheckoutModalProps {
  items: ItemCarrito[]
  onConfirmar: (datos: DatosCliente) => void
  onCancelar: () => void
}

function formatMoneda(n: number) {
  return `$${n.toFixed(2)}`
}

export function CheckoutModal({ items, onConfirmar, onCancelar }: CheckoutModalProps) {
  const [nombre, setNombre] = useState('')
  const [documento, setDocumento] = useState('')
  const [tipoDTE, setTipoDTE] = useState<TipoDTE>('01')
  const [error, setError] = useState('')

  const subtotal = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  const iva = subtotal * 0.13
  const total = subtotal + iva

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!nombre.trim()) { setError('El nombre del cliente es requerido.'); return }
    if (!documento.trim()) { setError('El número de documento es requerido.'); return }

    const dui = /^\d{8}-\d$/.test(documento.trim())
    const nit = /^\d{4}-\d{6}-\d{3}-\d$/.test(documento.trim())

    if (tipoDTE === '01' && !dui) {
      setError('Para Factura (01) ingresa un DUI válido (ej: 04589723-4).')
      return
    }
    if (tipoDTE === '03' && !nit) {
      setError('Para CCF (03) ingresa un NIT válido (ej: 0614-010190-102-3).')
      return
    }

    onConfirmar({ nombre: nombre.trim(), documento: documento.trim(), tipoDTE })
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Datos para facturación</h2>
          <button className={styles.cerrarBtn} onClick={onCancelar}>✕</button>
        </div>

        {/* Resumen de compra */}
        <div className={styles.resumenCompra}>
          <p className={styles.resumenLabel}>Resumen de compra</p>
          <div className={styles.resumenItems}>
            {items.map(item => (
              <div key={item.producto.productoId} className={styles.resumenItem}>
                <span className={styles.resumenItemNombre}>
                  {item.cantidad}× {item.producto.nombre}
                </span>
                <span className={styles.resumenItemPrecio}>
                  {formatMoneda(item.producto.precio * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.resumenTotales}>
            <span>Subtotal</span><span>{formatMoneda(subtotal)}</span>
            <span>IVA 13%</span><span>{formatMoneda(iva)}</span>
            <strong>Total</strong><strong>{formatMoneda(total)}</strong>
          </div>
        </div>

        {/* Formulario */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.tipoDTEGroup}>
            <p className={styles.groupLabel}>Tipo de documento tributario</p>
            <div className={styles.tipoBtns}>
              <button
                type="button"
                className={`${styles.tipoBtn} ${tipoDTE === '01' ? styles.tipoBtnActivo : ''}`}
                onClick={() => { setTipoDTE('01'); setDocumento('') }}
              >
                <span className={styles.tipoCodigo}>01</span>
                <span className={styles.tipoNombre}>Factura</span>
                <span className={styles.tipoDesc}>Consumidor final · DUI</span>
              </button>
              <button
                type="button"
                className={`${styles.tipoBtn} ${tipoDTE === '03' ? styles.tipoBtnActivo : ''}`}
                onClick={() => { setTipoDTE('03'); setDocumento('') }}
              >
                <span className={styles.tipoCodigo}>03</span>
                <span className={styles.tipoNombre}>CCF</span>
                <span className={styles.tipoDesc}>Crédito fiscal · NIT empresa</span>
              </button>
            </div>
          </div>

          <label className={styles.label}>
            Nombre del cliente / empresa
            <input
              type="text"
              className={styles.input}
              placeholder="Carlos Alberto Martínez López"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            {tipoDTE === '01' ? 'DUI' : 'NIT de la empresa'}
            <input
              type="text"
              className={styles.input}
              placeholder={tipoDTE === '01' ? '04589723-4' : '0614-010190-102-3'}
              value={documento}
              onChange={e => setDocumento(e.target.value)}
              required
            />
            <span className={styles.inputHint}>
              {tipoDTE === '01'
                ? 'Formato: 8 dígitos, guión, 1 dígito (ej: 04589723-4)'
                : 'Formato: XXXX-XXXXXX-XXX-X (ej: 0614-010190-102-3)'}
            </span>
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelarBtn} onClick={onCancelar}>
              Volver al carrito
            </button>
            <button type="submit" className={styles.confirmarBtn}>
              Emitir DTE y confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
