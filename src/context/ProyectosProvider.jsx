import axios from "axios";
import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom";

const ProyectoContext = createContext();
const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([]);
    const [proyecto, setProyecto] = useState({});
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false)

    const navigate = useNavigate();

    useEffect(()=>{
        const obtenerProyectos = async ()=>{
            try{
                const token = localStorage.getItem('token')
                if(!token) return
                const config ={
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                    
                }
                const url = `${import.meta.env.VITE_BACKEND_URL}/api/proyectos`
                const{data} = await axios(url, config)
                setProyectos(data)
            } catch(error){
                console.log(error)
            }
        }

        obtenerProyectos();
    }, [])

    const mostrarAlerta =alerta =>{
        setAlerta(alerta)
        setTimeout(()=>{
            setAlerta({})
        }, 5000);
    }

    const submitProyecto = async proyecto =>{
        if(proyecto.id){
            await editarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
    }

    const editarProyecto = async proyecto =>{
        try{
            const token = localStorage.getItem('token')
            if(!token) return
            const config ={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
                
            }
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${proyecto.id}`
            const{data} = await axios.put(url, proyecto, config)
            const proyectosActu = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActu)

            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate("/admin")
            }, 2000);
        } catch(error){
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto =>{

        try{
            const token = localStorage.getItem('token')
            if(!token) return
            const config ={
                headers:{
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
                
            }

            const url = `${import.meta.env.VITE_BACKEND_URL}/api/proyectos`
            const {data}= await axios.post(url, proyecto, config)
/*             setProyectos([...proyectos, data]) */
            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
            })

            setTimeout(()=>{
                setAlerta({})
                navigate("/admin")
            }, 2000);
        } catch(error){
            console.log(error)
        }
    }

    const obtenerProyecto = async (id)=>{

        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config ={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
                
            }
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`
            
            const{data} = await axios(url, config)
            setProyecto(data.proyecto)
        } catch (error) {
            console.log(error)
        }finally{
            setCargando(false)
        }
    }

    const eliminarProyecto = async id=>{
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            const config ={
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
                
            }
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`
            const{data} = await axios.delete(url, config)
            const proyectosActu = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActu)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(()=>{
                setAlerta({})
                navigate("/admin")
            }, 2000);
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <ProyectoContext.Provider
        value={{
            proyectos,
            mostrarAlerta,
            alerta,
            submitProyecto,
            obtenerProyecto,
            proyecto,
            cargando,
            eliminarProyecto
        }}
    >
        {children}
    </ProyectoContext.Provider>
  )
}

export{
    ProyectosProvider
}

export default ProyectoContext