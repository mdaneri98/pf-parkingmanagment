import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import ParkingLotProfile from './pages/ParkingLotProfile';
import { store } from './stores';
import { Provider } from 'react-redux';
import AppInitializer from './components/AppInitializer';
import './App.css'  

function App() {
  const [count, setCount] = useState(0)

  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ParkingLotProfile />} />
            </Routes>
        </Router>
      </AppInitializer>
    </Provider>
  )
}

export default App
