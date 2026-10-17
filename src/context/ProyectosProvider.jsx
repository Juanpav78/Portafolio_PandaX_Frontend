import { useState, createContext, useCallback, useRef } from "react"
import clientAxios from "../config/clientAxios";
import useAlerta from "../hooks/useAlerta";

const ProyectoContext = createContext();

// Campos opcionales que el usuario puede vaciar: estos sí se envían aunque estén en blanco
const VACIABLES = ['problema', 'solucion', 'descripcionEn', 'problemaEn', 'solucionEn']

// Se arma el FormData a mano para omitir campos vacíos: si se enviara imagen=undefined o
// github="" el backend los trataría como valores y, al editar, borraría los existentes.
// Los arrays (archivos de la galería) se añaden uno a uno con la misma clave: así
// express-fileupload los recibe juntos como req.files.galeria.
// No se fija Content-Type: el navegador añade el boundary del multipart automáticamente.
const crearFormData = proyecto => {
    const formData = new FormData()
    Object.entries(proyecto).forEach(([campo, valor]) => {
        if (campo === 'id' || valor === undefined || valor === null) return
        if (Array.isArray(valor)) return valor.forEach(item => formData.append(campo, item))
        if (valor === '' && !VACIABLES.includes(campo)) return
        formData.append(campo, valor)
    })
    return formData
}

// Convierte cualquier error de axios en un mensaje que se pueda mostrar al usuario
const mensajeError = (error, porDefecto) => error.response?.data?.msg ?? porDefecto

const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([]);
    const [cargando, setCargando] = useState(false)
    const [tarda, setTarda] = useState(false)
    const [error, setError] = useState(null)
    const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta()
    // Promesa de la petición en curso: el sitio público y el admin piden la lista al montarse
    // (y StrictMode monta dos veces en desarrollo); compartiendo la promesa sólo sale una petición.
    const peticion = useRef(null)
    const cargado = useRef(false)

    const obtenerProyectos = useCallback(({ forzar = false } = {}) => {
        if (peticion.current) return peticion.current
        if (cargado.current && !forzar) return Promise.resolve()

        setCargando(true)
        setError(null)
        // Render (plan gratis) duerme el backend tras ~15 min sin uso y la primera petición puede
        // tardar hasta un minuto. Pasados 3 s se activa `tarda` para que la interfaz explique la
        // espera en lugar de parecer rota.
        const aviso = setTimeout(() => setTarda(true), 3000)

        peticion.current = clientAxios('/proyectos')
            .then(({ data }) => {
                setProyectos(data.proyectos)
                cargado.current = true
            })
            .catch(() => setError('No se pudieron cargar los proyectos'))
            .finally(() => {
                clearTimeout(aviso)
                setTarda(false)
                setCargando(false)
                peticion.current = null
            })

        return peticion.current
    }, []);

    // Crear y editar devuelven el proyecto guardado o lanzan un Error con el mensaje del backend,
    // para que el formulario decida qué hacer (navegar, mostrar el error junto al botón, etc.).
    const submitProyecto = useCallback(async proyecto => {
        try {
            if (proyecto.id) {
                const { data } = await clientAxios.put(`/proyectos/${proyecto.id}`, crearFormData(proyecto))
                setProyectos(actuales => actuales.map(p => p._id === data._id ? data : p))
                mostrarAlerta('Proyecto actualizado correctamente', false)
                return data
            }
            const { data } = await clientAxios.post('/proyectos', crearFormData(proyecto))
            setProyectos(actuales => [...actuales, data])
            mostrarAlerta('Proyecto creado correctamente', false)
            return data
        } catch (error) {
            throw new Error(mensajeError(error, 'No se pudo guardar el proyecto'), { cause: error })
        }
    }, [mostrarAlerta])

    const eliminarProyecto = useCallback(async id => {
        try {
            const { data } = await clientAxios.delete(`/proyectos/${id}`)
            setProyectos(actuales => actuales.filter(p => p._id !== id))
            mostrarAlerta(data.msg, false)
        } catch (error) {
            mostrarAlerta(mensajeError(error, 'No se pudo eliminar el proyecto'))
            throw error
        }
    }, [mostrarAlerta])

    // Destacar y reordenar son optimistas: la estrella y el orden cambian al instante y, si el
    // servidor falla, se restaura la lista anterior. Son acciones de un click que se repiten
    // mucho; esperar a la red en cada una haría el panel lento.
    const conRespaldo = useCallback(async (aplicar, peticion, mensajeFallo) => {
        let anterior
        setProyectos(actuales => { anterior = actuales; return aplicar(actuales) })
        try {
            await peticion()
        } catch (error) {
            setProyectos(anterior)
            mostrarAlerta(mensajeError(error, mensajeFallo))
        }
    }, [mostrarAlerta])

    const destacarProyecto = useCallback((id, destacado) => conRespaldo(
        actuales => {
            // Igual que el backend: un destacado nuevo se coloca al final de los ya destacados
            const ultimo = Math.max(-1, ...actuales.filter(p => p.destacado).map(p => p.orden ?? 0))
            return actuales.map(p => p._id === id ? { ...p, destacado, orden: destacado ? ultimo + 1 : p.orden } : p)
        },
        () => clientAxios.patch(`/proyectos/${id}/destacado`, { destacado }),
        'No se pudo cambiar el destacado'
    ), [conRespaldo])

    const ordenarDestacados = useCallback(ids => conRespaldo(
        actuales => actuales.map(p => ids.includes(p._id) ? { ...p, orden: ids.indexOf(p._id) } : p),
        () => clientAxios.put('/proyectos/orden', { ids }),
        'No se pudo guardar el orden'
    ), [conRespaldo])

  return (
    <ProyectoContext.Provider
        value={{
            proyectos,
            obtenerProyectos,
            cargando,
            tarda,
            error,
            submitProyecto,
            eliminarProyecto,
            destacarProyecto,
            ordenarDestacados,
            alerta,
            mostrarAlerta,
            cerrarAlerta,
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
