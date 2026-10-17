import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub, faGitAlt, faFigma,
    faCss3Alt, faHtml5,
    faPhp, faNodeJs,
    faSquareJs, faReact, faPython,
    } from '@fortawesome/free-brands-svg-icons'
import { faChartColumn, faCode, faDatabase, faLanguage, faLightbulb, faTableCells } from '@fortawesome/free-solid-svg-icons'
import SectionTitle from '../components/SectionTitle'
import ConNegritas from '../components/ConNegritas'
import useIdioma from '../hooks/useIdioma'
import { REDES } from '../helpers/redes'

// Las habilidades sin icono en Font Awesome usan una imagen; `imagen` y `icono` son excluyentes.
// Ordenadas por relevancia según la hoja de vida: primero el stack principal, luego datos y
// automatización, y al final herramientas complementarias.
const SKILLS = [
  { nombre: 'React', icono: faReact },
  { nombre: 'Next.js', imagen: 'https://cdn.simpleicons.org/nextdotjs/white' },
  { nombre: 'JavaScript', icono: faSquareJs },
  { nombre: 'Node.js', icono: faNodeJs },
  { nombre: 'Python', icono: faPython },
  { nombre: 'MongoDB', imagen: 'https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg' },
  { nombre: 'MySQL', imagen: 'https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg' },
  { nombre: 'SQL', icono: faDatabase },
  { nombre: 'HTML5', icono: faHtml5 },
  { nombre: 'CSS3', icono: faCss3Alt },
  { nombre: 'PHP', icono: faPhp },
  { nombre: 'Power BI', icono: faChartColumn },
  { nombre: 'Excel · VBA', icono: faTableCells },
  { nombre: 'Git', icono: faGitAlt },
  { nombre: 'GitHub', icono: faGithub },
  { nombre: 'Figma', icono: faFigma },
]

// Iconos de los rasgos, en el mismo orden que about.traits en los textos traducidos
const ICONOS_RASGOS = [faCode, faDatabase, faLightbulb, faLanguage]

const aparecer = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
}

const About = () => {
  const { t } = useIdioma()
  return (
    <section id='about' className='scroll-mt-20 px-4 py-24 sm:px-6'>
      <div className='mx-auto max-w-6xl'>
        <SectionTitle etiqueta={t('about.label')} titulo={t('about.title')} destacado={t('about.highlight')} />

        <div className='grid gap-6 lg:grid-cols-[1.1fr_1fr]'>
          <motion.div {...aparecer} transition={{ duration: 0.6 }}
            className='glass neon-border flex flex-col rounded-3xl p-8'>
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              {t('about.paragraphs').map(parrafo => <p key={parrafo}><ConNegritas texto={parrafo} /></p>)}
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3">
              {t('about.traits').map((rasgo, i) => (
                <li key={rasgo.titulo} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/2 p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon">
                    <FontAwesomeIcon icon={ICONOS_RASGOS[i]} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-fg">{rasgo.titulo}</p>
                    <p className="text-xs text-subtle">{rasgo.texto}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className='mt-8 flex gap-2'>
              {REDES.slice(0, 4).map(red => (
                <li key={red.nombre}>
                  <a href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}
                    className="btn btn-ghost btn-icon text-lg"><FontAwesomeIcon icon={red.icono} /></a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...aparecer} transition={{ duration: 0.6, delay: 0.1 }} className='glass rounded-3xl p-8'>
            <h3 className='mb-6 flex items-center gap-3 font-display text-2xl text-fg'>
              {t('about.stack')} <span className="h-px flex-1 bg-linear-to-r from-neon/50 to-transparent" />
            </h3>
            <ul className='grid grid-cols-3 gap-3 sm:grid-cols-4'>
              {SKILLS.map((skill, i) => (
                <motion.li
                  key={skill.nombre}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 20 }}
                  className='group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-white/5
                    bg-white/2 text-muted transition-all duration-300
                    hover:-translate-y-1 hover:border-neon/40 hover:bg-neon/5 hover:text-neon hover:shadow-[0_0_24px_-8px_var(--color-neon)]'
                >
                  {skill.icono
                    ? <FontAwesomeIcon className='text-3xl' icon={skill.icono} />
                    : <img src={skill.imagen} alt="" loading="lazy" className='size-8 opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0' />}
                  <span className='text-xs font-semibold'>{skill.nombre}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
