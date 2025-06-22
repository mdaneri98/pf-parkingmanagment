import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import ParkingLotProfile from './pages/ParkingLotProfile';
import { store } from './stores';
import { Provider } from 'react-redux';
import AppInitializer from './components/AppInitializer';
import BaseLayout from './templates/BaseLayout';
import './App.css'  

function App() {

  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
          <BaseLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<ParkingLotProfile />} />
              </Routes>
            </BaseLayout>
        </Router>
      </AppInitializer>
    </Provider>
  )
}

export default App
