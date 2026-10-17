import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBriefcase, faDownload, faGraduationCap, faLanguage } from "@fortawesome/free-solid-svg-icons"
import Boton from "../components/Boton"
import SectionTitle from "../components/SectionTitle"
import useIdioma from "../hooks/useIdioma"
import HDV from '../assets/HDV_JuanPAV_2026.pdf'

const aparecer = (retardo = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, delay: retardo },
})

const Encabezado = ({ icono, children }) => (
  <h3 className="mb-6 flex items-center gap-3 font-display text-2xl text-fg">
    <span className="grid size-10 place-items-center rounded-xl bg-neon/10 text-base text-neon"><FontAwesomeIcon icon={icono} /></span>
    {children}
  </h3>
)

// Experiencia, educación e idiomas sacados de la hoja de vida. Los datos viven en los textos
// traducidos (journey.* en i18n/textos.js) para que se actualicen en un solo sitio y en ambos idiomas.
const Trayectoria = () => {
  const { t } = useIdioma()

  return (
    <section id="trayectoria" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle etiqueta={t('journey.label')} titulo={t('journey.title')} destacado={t('journey.highlight')} />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div {...aparecer()} className="glass rounded-3xl p-6 sm:p-8">
            <Encabezado icono={faBriefcase}>{t('journey.work')}</Encabezado>
            {/* Línea de tiempo: la línea vertical es el borde izquierdo de la lista y cada
                puesto tiene un punto neón encima; el puesto actual además late */}
            <ol className="relative ml-3 border-l border-white/10">
              {t('journey.jobs').map((trabajo, i) => (
                <motion.li key={trabajo.empresa} {...aparecer(0.1 + i * 0.1)} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[7px] flex size-3.5">
                    {trabajo.actual && <span className="absolute inline-flex size-full animate-ping rounded-full bg-neon opacity-60" />}
                    <span className={`relative inline-flex size-3.5 rounded-full border-2 border-ink-950 ${trabajo.actual ? 'bg-neon shadow-[0_0_12px_var(--color-neon)]' : 'bg-ink-600'}`} />
                  </span>
                  <p className="font-mono text-xs tracking-wider text-neon-soft uppercase">{trabajo.fecha}</p>
                  <h4 className="mt-1 text-lg font-bold text-fg">
                    {trabajo.puesto} <span className="text-muted">· {trabajo.empresa}</span>
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {trabajo.puntos.map(punto => (
                      <li key={punto} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neon/60" />
                        {punto}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div {...aparecer(0.1)} className="glass rounded-3xl p-6 sm:p-8">
              <Encabezado icono={faGraduationCap}>{t('journey.education')}</Encabezado>
              {t('journey.studies').map(estudio => (
                <div key={estudio.titulo}>
                  <p className="font-mono text-xs tracking-wider text-neon-soft uppercase">{estudio.fecha}</p>
                  <h4 className="mt-1 font-bold text-fg">{estudio.titulo}</h4>
                  <p className="text-sm text-subtle">{estudio.lugar}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{estudio.texto}</p>
                </div>
              ))}
            </motion.div>

            <motion.div {...aparecer(0.2)} className="glass rounded-3xl p-6 sm:p-8">
              <Encabezado icono={faLanguage}>{t('journey.languages')}</Encabezado>
              {/* Sólo el nivel en texto: una barra con porcentaje inventaría una precisión que
                  no existe. Para indicar un nivel concreto (p. ej. "B1") basta con cambiar el texto. */}
              <ul className="flex flex-col divide-y divide-white/5">
                {t('journey.langs').map(lengua => (
                  <li key={lengua.nombre} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="font-semibold text-fg">{lengua.nombre}</span>
                    <span className="chip">{lengua.nivel}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <Boton href={HDV} download="HojaDeVida_JuanPabloAlvarado.pdf" variant="ghost" size="lg" icon={faDownload}>
              {t('journey.cv')}
            </Boton>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Trayectoria
