import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faArrowUpRightFromSquare, faCalendar, faLightbulb, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"
import GaleriaImagenes from "./GaleriaImagenes"
import useIdioma from "../hooks/useIdioma"
import { formatearFecha, parseTecnologias } from "../helpers/proyectos"

// Contenido completo de un proyecto. Se comparte entre el modal público y la vista previa del
// admin, así el administrador ve exactamente lo mismo que verá un visitante.
const DetalleProyecto = ({ proyecto, idTitulo }) => {
  const { t, campo, idioma } = useIdioma()
  const { nombre, imagen, galeria = [], tipo, tecnologias, link, github } = proyecto
  const techs = parseTecnologias(tecnologias)
  const imagenes = [imagen, ...galeria].filter(img => img?.secure_url)

  // Sólo los proyectos que tienen el caso de estudio relleno muestran esta sección
  const caso = [
    { titulo: t('detail.challenge'), texto: campo(proyecto, 'problema'), icono: faTriangleExclamation, clase: 'text-neon-pink bg-neon-pink/10' },
    { titulo: t('detail.solution'), texto: campo(proyecto, 'solucion'), icono: faLightbulb, clase: 'text-success bg-success/10' },
  ].filter(bloque => bloque.texto)

  return (
    <article>
      {/* key: al pasar a otro proyecto el carrusel vuelve a su primera imagen */}
      <GaleriaImagenes key={proyecto._id} imagenes={imagenes} nombre={nombre} />

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
        {tipo && <span className="chip">{tipo}</span>}
        <span className="inline-flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} className="text-neon" />
          {formatearFecha(proyecto, idioma)}
        </span>
      </div>

      <h2 id={idTitulo} className="mt-3 font-display text-3xl text-fg md:text-4xl">{nombre}</h2>

      {/* whitespace-pre-line respeta los saltos de línea escritos en el textarea del admin */}
      <p className="mt-4 leading-relaxed whitespace-pre-line text-muted">{campo(proyecto, 'descripcion')}</p>

      {caso.length > 0 && (
        <div className={`mt-6 grid gap-3 ${caso.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {caso.map(({ titulo, texto, icono, clase }) => (
            <section key={titulo} className="rounded-2xl border border-white/5 bg-white/2 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-fg">
                <span className={`grid size-7 place-items-center rounded-lg text-xs ${clase}`}><FontAwesomeIcon icon={icono} /></span>
                {titulo}
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{texto}</p>
            </section>
          ))}
        </div>
      )}

      {techs.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 font-mono text-xs tracking-widest text-subtle uppercase">{t('detail.stack')}</h3>
          <ul className="flex flex-wrap gap-2">
            {techs.map(tech => <li key={tech} className="chip text-xs">{tech}</li>)}
          </ul>
        </div>
      )}

      {/* GitHub es opcional en el backend: el botón sólo aparece si hay repositorio */}
      {(link || github) && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {link && (
            <Boton href={link} iconRight={faArrowUpRightFromSquare} className="flex-1">
              {t('detail.visit')}
            </Boton>
          )}
          {github && (
            <Boton href={github} variant="ghost" icon={faGithub} className="flex-1">
              {t('detail.source')}
            </Boton>
          )}
        </div>
      )}
    </article>
  )
}

export default DetalleProyecto
