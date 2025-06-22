import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
      </Router>
  )
}

export default App
