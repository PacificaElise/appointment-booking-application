import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/'
            element={<Home />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
