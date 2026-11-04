import { Link } from "react-router"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare, faEye, faPen, faStar, faTrash } from "@fortawesome/free-solid-svg-icons"
import { faStar as faStarVacia } from "@fortawesome/free-regular-svg-icons"
import Resaltado from "./Resaltado"
import useProyectos from "../hooks/useProyectos"
import { BadgesSitios } from "./admin/BadgeSitio"
import { sitiosDe } from "../helpers/sitios"
import InterruptorPublicado from "./admin/InterruptorPublicado"
import { dominio, formatearFecha, imagenOptimizada, parseTecnologias } from "../helpers/proyectos"

// Acciones compartidas por ambas vistas. Llevan aria-label con el nombre del proyecto porque
// sólo muestran un icono: sin él, un lector de pantalla leería "Editar, Editar, Editar…".
const Acciones = ({ proyecto, onEliminar }) => {
  const { destacarProyecto } = useProyectos()
  return (
  <div className="flex items-center gap-1">
    {/* aria-pressed: el lector de pantalla anuncia si el proyecto está destacado o no */}
    <button onClick={() => destacarProyecto(proyecto._id, !proyecto.destacado)} aria-pressed={Boolean(proyecto.destacado)}
      className={`btn btn-subtle btn-icon ${proyecto.destacado ? 'text-neon-amber drop-shadow-[0_0_8px_var(--color-neon-amber)]' : 'hover:text-neon-amber'}`}
      title={proyecto.destacado ? 'Quitar de destacados' : 'Destacar en la home'}
      aria-label={`Destacar ${proyecto.nombre}`}>
      <FontAwesomeIcon icon={proyecto.destacado ? faStar : faStarVacia} />
    </button>
    <Link to={`/admin/preview/${proyecto._id}`} className="btn btn-subtle btn-icon" title="Vista previa"
      aria-label={`Vista previa de ${proyecto.nombre}`}><FontAwesomeIcon icon={faEye} /></Link>
    <Link to={`/admin/edit/${proyecto._id}`} className="btn btn-subtle btn-icon hover:text-neon" title="Editar"
      aria-label={`Editar ${proyecto.nombre}`}><FontAwesomeIcon icon={faPen} /></Link>
    <button onClick={() => onEliminar(proyecto)} className="btn btn-subtle btn-icon hover:text-danger" title="Eliminar"
      aria-label={`Eliminar ${proyecto.nombre}`}><FontAwesomeIcon icon={faTrash} /></button>
  </div>
  )
}

const Publicado = ({ proyecto }) => {
  const { publicarProyecto } = useProyectos()
  return <InterruptorPublicado publicado={proyecto.publicado !== false} nombre={proyecto.nombre}
    onChange={valor => publicarProyecto(proyecto._id, valor)} />
}

// Un proyecto dentro del listado del admin, en formato fila (vista lista) o tarjeta (vista grid).
const PreviewProyecto = ({ proyecto, vista = 'lista', busqueda, onEliminar }) => {
  const { nombre, imagen, tipo, link } = proyecto
  const techs = parseTecnologias(proyecto.tecnologias)
  const miniatura = imagenOptimizada(imagen?.secure_url, vista === 'grid' ? 560 : 160)

  const animacion = {
    layout: true,
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.97 },
    transition: { duration: 0.25 },
  }

  if (vista === 'grid') {
    return (
      <motion.li {...animacion} className={`group tarjeta overflow-hidden transition-colors hover:border-white/20 ${proyecto.publicado === false ? 'opacity-70' : ''}`}>
        <Link to={`/admin/preview/${proyecto._id}`} className="block aspect-16/10 overflow-hidden bg-ink-700">
          {miniatura && <img src={miniatura} alt="" loading="lazy" className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />}
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-bold text-fg"><Resaltado texto={nombre} busqueda={busqueda} /></h3>
              <p className="text-xs text-subtle capitalize">{tipo} · {formatearFecha(proyecto, 'es')}</p>
            </div>
            <Acciones proyecto={proyecto} onEliminar={onEliminar} />
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <BadgesSitios sitios={sitiosDe(proyecto)} />
            <Publicado proyecto={proyecto} />
          </div>
        </div>
      </motion.li>
    )
  }

  return (
    <motion.li {...animacion}
      className={`grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-white/3
        md:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_7.5rem_auto] ${proyecto.publicado === false ? 'opacity-70' : ''}`}>
      <div className="col-span-2 flex min-w-0 items-center gap-4 md:col-span-1">
        <div className="h-12 w-18 shrink-0 overflow-hidden rounded-lg bg-ink-700 ring-1 ring-white/10">
          {miniatura && <img src={miniatura} alt="" loading="lazy" className="size-full object-cover object-top" />}
        </div>
        <div className="min-w-0">
          <Link to={`/admin/preview/${proyecto._id}`} className="block truncate font-bold text-fg hover:text-neon-soft">
            <Resaltado texto={nombre} busqueda={busqueda} />
          </Link>
          <p className="flex min-w-0 items-center gap-1.5 truncate text-xs text-subtle">
            <span className="capitalize">{tipo}</span> · <span>{formatearFecha(proyecto, 'es')}</span>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 truncate hover:text-neon">
                · {dominio(link)} <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[0.6rem]" />
              </a>
            )}
          </p>
        </div>
      </div>
      <div className="col-span-3 flex flex-wrap items-center gap-3 md:col-span-1"><BadgesSitios sitios={sitiosDe(proyecto)} /></div>
      <ul className="hidden flex-wrap gap-1.5 md:flex">
        {techs.slice(0, 3).map(tech => <li key={tech} className="chip">{tech}</li>)}
        {techs.length > 3 && <li className="chip border-white/10 bg-white/5 text-muted">+{techs.length - 3}</li>}
      </ul>
      <div className="hidden md:block"><Publicado proyecto={proyecto} /></div>
      <div className="col-start-3 row-start-1 flex items-center gap-2 md:col-start-auto md:row-start-auto">
        <span className="md:hidden"><Publicado proyecto={proyecto} /></span>
        <Acciones proyecto={proyecto} onEliminar={onEliminar} />
      </div>
    </motion.li>
  )
}

export default PreviewProyecto
