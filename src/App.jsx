import {BrowserRouter, Routes, Route} from 'react-router-dom';
import IndexLayout from './layouts/IndexLayout';
import Proyects from './pages/Proyects';
import Index from './pages/Index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexLayout />}>
          <Route index  element={<Index />} />

          <Route path='/proyects' element={<Proyects />} />
        </Route>
        <Route path='/admin'>
          
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
