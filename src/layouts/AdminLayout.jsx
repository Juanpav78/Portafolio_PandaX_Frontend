import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Footer from "../components/Footer"
import HeaderAdmin from "../components/HeaderAdmin"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {

  const {auth, cargando} = useAuth();

  if(cargando) return "Cargando"
  return (
    <>
    {auth._id ? (
      <> 
      <HeaderAdmin />
      <div className='md:flex md:min-h-screen'>
      <Sidebar />
      <main className='flex-1  p-10'>
      <Outlet />
      </main>
      </div>
      
      <Footer />
      </>
    ):(
      <Navigate to="/login" />
    )}
    
    </>
  )
}

export default AdminLayout