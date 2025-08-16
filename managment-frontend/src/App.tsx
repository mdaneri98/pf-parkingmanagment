import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './stores';
import { Provider } from 'react-redux';
import AppInitializer from './components/AppInitializer';
import AppRouter from './AppRouter';
import './App.css'  

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
          <AppRouter />
        </Router>
      </AppInitializer>
    </Provider>
  )
}

export default App
