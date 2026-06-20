import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar/Navbar'
import { LandingPage } from './features/landing/LandingPage'
import { VentasPage } from './features/ventas/VentasPage'
import { AdminPage } from './features/admin/AdminPage'

export function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  )
}
