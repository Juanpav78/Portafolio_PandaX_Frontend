import {BrowserRouter, Routes, Route} from 'react-router-dom';
import IndexLayout from './layouts/IndexLayout';
import Proyects from './pages/Proyects';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Password from './pages/Password';
import Confirm from './pages/Confirm';
import AdminLayout from './layouts/AdminLayout';
import IndexAdmin from './pages/IndexAdmin';
import Edit from './pages/Edit';
import Create from './pages/Create';
import NewPassword from './pages/NewPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexLayout />}>
          <Route index  element={<Index />} />

          <Route path='proyects'                  element={<Proyects />} />
          <Route path='login'                     element={<Login />} />
          <Route path='signup'                    element={<Signup />} />
          <Route path='recover-password'          element={<Password />} />
          <Route path='recover-password/:token'   element={<NewPassword />} />
          <Route path='confirm/:id'               element={<Confirm />} />
        </Route>
        <Route path='/admin/' element={<AdminLayout />}>
          <Route index  element={<IndexAdmin />} />
          <Route path='create'              element={<Create />} />
          <Route path='edit/:id'            element={<Edit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
