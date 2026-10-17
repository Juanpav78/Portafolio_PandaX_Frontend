import { useMemo } from "react"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import useProyectos from "../hooks/useProyectos"
import Boton from "../components/Boton"
import SectionTitle from "../components/SectionTitle"
import GaleriaProyectos from "../components/GaleriaProyectos"
import { ordenarProyectos } from "../helpers/proyectos"
import useIdioma from "../hooks/useIdioma"

const DESTACADOS = 6

// Sección de la home: primero los destacados (en el orden elegido en el admin) y se completa
// con los más recientes. El catálogo completo con búsqueda y filtros vive en /proyectos.
const Proyects = () => {
  const { proyectos } = useProyectos()
  const { t } = useIdioma()
  const seleccion = useMemo(() => ordenarProyectos(proyectos, 'destacados').slice(0, DESTACADOS), [proyectos])

  return (
    <section className='scroll-mt-20 px-4 py-24 sm:px-6' id="proyects">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          etiqueta={t('projects.label')}
          titulo={t('projects.title')}
          destacado={t('projects.highlight')}
          descripcion={t('projects.description')}
        />

        <GaleriaProyectos proyectos={seleccion} />

        {proyectos.length > DESTACADOS && (
          <div className="mt-12 flex justify-center">
            <Boton to="/proyectos" variant="ghost" size="lg" iconRight={faArrowRight}>
              {t('projects.seeAll', { n: proyectos.length })}
            </Boton>
          </div>
        )}
      </div>
    </section>
  )
}

export default Proyects
