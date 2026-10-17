import { useCallback, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck, faRocket, faTrash } from "@fortawesome/free-solid-svg-icons"
import usePlanes from "../hooks/usePlanes"
import Boton from "../components/Boton"
import ConfirmDialog from "../components/ConfirmDialog"
import EncabezadoAdmin from "../components/EncabezadoAdmin"
import FormularioPlan from "../components/FormularioPlan"
import ListaTareas from "../components/ListaTareas"
import ProyectoNoEncontrado from "../components/ProyectoNoEncontrado"
import { ESTADOS } from "../helpers/planes"

const VOLVER = { to: '/admin/planes', texto: 'Planificador' }

// Sirve tanto para /admin/planes/nuevo (sin id) como para /admin/planes/:id
const PlanDetalle = () => {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { planes, cargando, eliminarPlan } = usePlanes()
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const cancelar = useCallback(() => setConfirmando(false), [])

  const plan = id ? planes.find(p => p._id === id) : null
  // El "+" de cada columna del tablero abre el formulario con ?estado=… ya elegido
  const estadoInicial = ESTADOS.some(e => e.id === params.get('estado')) ? params.get('estado') : undefined

  if (id && !plan) {
    return cargando
      ? <div className="skeleton h-96 rounded-2xl" />
      : <ProyectoNoEncontrado titulo="Plan no encontrado" volver={{ to: '/admin/planes', texto: 'Volver al planificador' }} />
  }

  const eliminar = async () => {
    setEliminando(true)
    try {
      await eliminarPlan(id)
      navigate('/admin/planes')
    } catch {
      setEliminando(false)
    }
  }

  // Al terminar un plan, el formulario de proyecto se abre ya relleno con sus datos: sólo
  // falta añadir el enlace y la captura para que aparezca en el portafolio público.
  const publicar = () => navigate('/admin/create', {
    state: { borrador: { nombre: plan.nombre, descripcion: plan.descripcion, tecnologias: plan.tecnologias } },
  })

  return (
    <>
      <EncabezadoAdmin etiqueta={plan ? 'plan' : 'nueva idea'} titulo={plan?.nombre ?? 'Nuevo plan'} volver={VOLVER}>
        {plan && (
          <>
            <Boton variant="ghost" icon={faTrash} onClick={() => setConfirmando(true)} className="hover:text-danger! hover:border-danger/60!">
              Eliminar
            </Boton>
            {plan.estado === 'completado' && <Boton icon={faRocket} onClick={publicar}>Publicar en portafolio</Boton>}
          </>
        )}
      </EncabezadoAdmin>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        {/* key: si se navega de un plan a otro, el formulario se reinicia con los datos del nuevo */}
        <FormularioPlan key={id ?? 'nuevo'} plan={plan} estadoInicial={estadoInicial} />

        {plan ? (
          <div className="lg:sticky lg:top-26">
            <ListaTareas plan={plan} />
          </div>
        ) : (
          <div className="glass flex flex-col items-center gap-3 rounded-2xl p-8 text-center text-sm text-subtle">
            <FontAwesomeIcon icon={faListCheck} className="text-3xl" />
            Crea el plan y después podrás dividirlo en tareas.
          </div>
        )}
      </div>

      {plan && (
        <ConfirmDialog
          abierto={confirmando}
          titulo="¿Eliminar plan?"
          mensaje={<>Se eliminará <strong className="text-fg">{plan.nombre}</strong> con sus {plan.tareas.length} tareas.</>}
          cargando={eliminando}
          onConfirmar={eliminar}
          onCancelar={cancelar}
        />
      )}
    </>
  )
}

export default PlanDetalle
