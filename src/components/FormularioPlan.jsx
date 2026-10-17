import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"
import Campo from "./Campo"
import CampoTecnologias from "./CampoTecnologias"
import usePlanes from "../hooks/usePlanes"
import useProyectos from "../hooks/useProyectos"
import { ESTADOS, PRIORIDADES, claveFecha } from "../helpers/planes"
import { contarTecnologias, parseTecnologias } from "../helpers/proyectos"

// Grupo de botones que funciona como un radio (una sola opción activa). Para una lista corta
// de opciones es más rápido de usar que un <select>: todo se ve y se elige con un click.
const Selector = ({ etiqueta, opciones, valor, onCambiar }) => (
  <fieldset className="flex flex-col gap-1.5">
    <legend className="mb-1.5 text-sm font-semibold text-fg/90">{etiqueta}</legend>
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {opciones.map(op => (
        <button
          key={op.id}
          type="button"
          role="radio"
          aria-checked={valor === op.id}
          onClick={() => onCambiar(op.id)}
          className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all
            ${valor === op.id ? 'border-neon/60 bg-neon/10 text-fg shadow-[0_0_18px_-8px_var(--color-neon)]' : 'border-white/10 text-muted hover:text-fg'}`}
        >
          {op.icono && <FontAwesomeIcon icon={op.icono} className={op.texto} />}
          {op.nombre}
        </button>
      ))}
    </div>
  </fieldset>
)

const OPCIONES_PRIORIDAD = Object.entries(PRIORIDADES).map(([id, p]) => ({ id, nombre: p.nombre }))

const datosIniciales = (plan, estadoInicial) => ({
  nombre: plan?.nombre ?? '',
  descripcion: plan?.descripcion ?? '',
  estado: plan?.estado ?? estadoInicial ?? 'idea',
  prioridad: plan?.prioridad ?? 'media',
  fechaInicio: claveFecha(plan?.fechaInicio),
  fechaLimite: claveFecha(plan?.fechaLimite),
  tecnologias: plan?.tecnologias ?? '',
})

// Crea o edita la información general de un plan. Las tareas se gestionan aparte (ListaTareas)
// y se guardan al instante; este formulario se guarda con su botón porque son varios campos.
const FormularioPlan = ({ plan, estadoInicial }) => {
  const { crearPlan, actualizarPlan } = usePlanes()
  const { proyectos } = useProyectos()
  const navigate = useNavigate()
  const inicial = useMemo(() => datosIniciales(plan, estadoInicial), [plan, estadoInicial])
  const [datos, setDatos] = useState(inicial)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  // Sugiere tecnologías ya usadas en el portafolio para mantener la misma escritura
  const sugerencias = useMemo(() => contarTecnologias(proyectos).map(t => t.valor), [proyectos])
  // Sólo se habilita "Guardar" si algo cambió; evita peticiones inútiles y deja claro el estado
  const hayCambios = JSON.stringify(datos) !== JSON.stringify(inicial)

  const cambiar = (campo, valor) => setDatos(actuales => ({ ...actuales, [campo]: valor }))

  const handleSubmit = async e => {
    e.preventDefault()
    const nuevos = {}
    if (!datos.nombre.trim()) nuevos.nombre = 'Ponle un nombre al plan'
    // Las claves "YYYY-MM-DD" se pueden comparar como texto: el orden alfabético es el cronológico
    if (datos.fechaInicio && datos.fechaLimite && datos.fechaLimite < datos.fechaInicio) {
      nuevos.fechaLimite = 'La entrega no puede ser antes del inicio'
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return document.getElementById(Object.keys(nuevos)[0])?.focus()

    setEnviando(true)
    try {
      if (plan) {
        await actualizarPlan(plan._id, datos)
      } else {
        const creado = await crearPlan(datos)
        // replace: al volver atrás no debe reaparecer el formulario vacío de "nuevo"
        navigate(`/admin/planes/${creado._id}`, { replace: true })
      }
    } catch (error) {
      setErrores({ general: error.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass flex flex-col gap-5 rounded-2xl p-6">
      <Campo label="Nombre" id="nombre" placeholder="App de recetas, rediseño de mi blog…" maxLength={120}
        value={datos.nombre} onChange={e => cambiar('nombre', e.target.value)} error={errores.nombre} />
      <Campo as="textarea" label="¿Qué quieres construir?" id="descripcion" rows={4} className="resize-y"
        placeholder="Objetivo, funcionalidades principales, inspiración…"
        value={datos.descripcion} onChange={e => cambiar('descripcion', e.target.value)} />

      <Selector etiqueta="Estado" opciones={ESTADOS} valor={datos.estado} onCambiar={v => cambiar('estado', v)} />
      <Selector etiqueta="Prioridad" opciones={OPCIONES_PRIORIDAD} valor={datos.prioridad} onCambiar={v => cambiar('prioridad', v)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Inicio" id="fechaInicio" type="date" value={datos.fechaInicio} onChange={e => cambiar('fechaInicio', e.target.value)} />
        <Campo label="Entrega" id="fechaLimite" type="date" value={datos.fechaLimite} onChange={e => cambiar('fechaLimite', e.target.value)}
          error={errores.fechaLimite} hint="Aparecerá en el calendario" />
      </div>

      <CampoTecnologias
        techs={parseTecnologias(datos.tecnologias)}
        setTechs={techs => cambiar('tecnologias', techs.join(', '))}
        sugerencias={sugerencias}
        hint="Se copiarán al publicarlo en el portafolio."
      />

      {errores.general && <p role="alert" className="text-sm font-semibold text-danger">{errores.general}</p>}

      <div className="flex justify-end gap-3">
        {plan && hayCambios && (
          <Boton variant="subtle" onClick={() => { setDatos(inicial); setErrores({}) }}>Descartar</Boton>
        )}
        <Boton type="submit" icon={faFloppyDisk} loading={enviando} disabled={plan && !hayCambios}>
          {plan ? 'Guardar cambios' : 'Crear plan'}
        </Boton>
      </div>
    </form>
  )
}

export default FormularioPlan
