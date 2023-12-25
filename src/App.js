import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile/Profile';

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
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
