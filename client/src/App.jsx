import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './layout/MainLayout';
import AllUsers from './components/AllUsers';

function App() {


  return (
    <Router>
      <Routes>
        <Route path='login' element={<Login/>} />
        <Route path='*' element={<h1>Page not found</h1>} />
        <Route path='register' element={<Register/>} />
        <Route path='/' element={<MainLayout/>} >
          <Route index element={<AllUsers/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
