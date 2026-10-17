import { lazy, Suspense } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router';
import { MotionConfig } from 'framer-motion';
import IndexLayout from './layouts/IndexLayout';
import Index from './pages/Index';
import Login from './pages/Login';
import Password from './pages/Password';
import NewPassword from './pages/NewPassword';

import { AuthProvider } from './context/AuthProvider';
import { ProyectosProvider } from './context/ProyectosProvider';
import { IdiomaProvider } from './context/IdiomaProvider';
import Portafolio from './pages/Portafolio';
import Loading from './components/Loading';
import NoEncontrada from './pages/NoEncontrada';

// El panel de admin se carga bajo demanda para no inflar el bundle público
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const IndexAdmin = lazy(() => import('./pages/IndexAdmin'));
const Edit = lazy(() => import('./pages/Edit'));
const Create = lazy(() => import('./pages/Create'));
const Proyecto = lazy(() => import('./pages/Proyecto'));
const Planes = lazy(() => import('./pages/Planes'));
const PlanDetalle = lazy(() => import('./pages/PlanDetalle'));
const Calendario = lazy(() => import('./pages/Calendario'));

function App() {
  return (
    <BrowserRouter>
    {/* reducedMotion="user": si el sistema pide reducir movimiento, Framer Motion omite las
        animaciones de transform y deja sólo los fundidos de opacidad */}
    <MotionConfig reducedMotion="user">
    <IdiomaProvider>
    <AuthProvider>
      <ProyectosProvider>
      <Suspense fallback={<Loading />}>
      <Routes>
        <Route path='/' element={<IndexLayout />}>
          <Route index  element={<Index />} />

          <Route path='proyectos'                 element={<Portafolio />} />
          <Route path='login'                     element={<Login />} />
          <Route path='recover-password'          element={<Password />} />
          <Route path='recover-password/:token'   element={<NewPassword />} />
          {/* Comodín: cualquier ruta pública que no exista muestra el 404 con header y footer */}
          <Route path='*'                         element={<NoEncontrada />} />
        </Route>
        <Route path='/admin/' element={<AdminLayout />}>
          <Route index    element={<IndexAdmin />} />
          <Route path='create'              element={<Create />} />
          <Route path='preview/:id'         element={<Proyecto />} />
          <Route path='edit/:id'            element={<Edit />} />
          <Route path='planes'              element={<Planes />} />
          <Route path='planes/nuevo'        element={<PlanDetalle />} />
          <Route path='planes/:id'          element={<PlanDetalle />} />
          <Route path='calendario'          element={<Calendario />} />
          <Route path='*'                   element={<NoEncontrada admin />} />
        </Route>
      </Routes>
      </Suspense>
      </ProyectosProvider>
    </AuthProvider>
    </IdiomaProvider>
    </MotionConfig>
    </BrowserRouter>
  )
}

export default App
