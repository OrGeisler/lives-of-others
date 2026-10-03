import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Admin from './pages/Admin'
import DogPage from './pages/DogPage'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="dogs/:slug" element={<DogPage />} />
        <Route path="*" element={<div className="wrap" style={{ padding: '80px 0' }}>העמוד לא נמצא.</div>} />
      </Route>
      <Route path="admin/*" element={<Admin />} />
    </Routes>
  )
}
