import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import HomePage from './pages/HomePage'
import FoodMenuPage from './pages/FoodMenuPage'
import ReservationsPage from './pages/ReservationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<FoodMenuPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  )
}
