import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import { store } from './stores';
import { Provider } from 'react-redux';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
      </Router>
    </Provider>
  )
}

export default App
