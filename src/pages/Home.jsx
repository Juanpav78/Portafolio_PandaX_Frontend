import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReact, faNodeJs, faJs } from '@fortawesome/free-brands-svg-icons'
import { faArrowDown, faArrowRight, faDownload } from '@fortawesome/free-solid-svg-icons'
import Boton from '../components/Boton'
import useProyectos from '../hooks/useProyectos'
import useIdioma from '../hooks/useIdioma'
import { REDES } from '../helpers/redes'
import Perfil from '../assets/Perfil.png'
import PerfilWeb from '../build/images/Perfil.webp'
import HDV from '../assets/HDV_JuanPAV_2026.pdf'

// Insignias que flotan alrededor del avatar. Cada una con distinto retardo para que no
// suban y bajen sincronizadas (se notaría artificial).
const INSIGNIAS = [
  { icono: faReact, clase: 'top-[8%] -left-2 text-neon-cyan', retardo: '0s' },
  { icono: faNodeJs, clase: 'bottom-[14%] -left-4 text-success', retardo: '1.5s' },
  { icono: faJs, clase: 'top-[18%] -right-3 text-neon-amber', retardo: '3s' },
]

// Variantes para que los elementos del texto entren en cascada: el contenedor sólo orquesta
// (staggerChildren) y cada hijo define su propia animación.
const contenedor = { oculto: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }
const item = {
  oculto: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const Home = () => {
  const { proyectos } = useProyectos()
  const { t } = useIdioma()
  const roles = t('home.roles')
  const [rol, setRol] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => setRol(actual => (actual + 1) % roles.length), 2800)
    return () => clearInterval(intervalo)
  }, [roles.length])

  return (
    <section id='home' className='relative flex min-h-svh items-center overflow-clip px-4 pt-28 pb-16 sm:px-6'>
      {/* Halos de color que flotan detrás del contenido */}
      <div aria-hidden className="pointer-events-none absolute top-1/4 -left-32 size-96 animate-float rounded-full bg-neon/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-10 size-80 animate-float rounded-full bg-neon-pink/20 blur-[120px] [animation-delay:2s]" />

      <div className='mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-[1.2fr_1fr]'>
        <motion.div variants={contenedor} initial="oculto" animate="visible" className='flex flex-col items-center text-center md:items-start md:text-left'>
          <motion.span variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/5 px-4 py-1.5 text-sm font-semibold text-success">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {t('home.available')}
          </motion.span>

          <motion.h1 variants={item} className='font-display text-5xl leading-tight text-fg sm:text-6xl lg:text-7xl'>
            {t('home.hi')} <br className="hidden sm:block" />
            <span className="neon-text animate-flicker">Juan Alvarado</span>
          </motion.h1>

          <motion.div variants={item} className="mt-4 flex h-10 items-center gap-3 font-mono text-xl text-muted sm:text-2xl">
            <span className="text-neon">&gt;</span>
            {/* El rol cambia cada pocos segundos; mode="wait" deja salir el anterior antes de
                que entre el siguiente para que nunca se solapen */}
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[rol]}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="text-fg"
              >
                {roles[rol]}
              </motion.span>
            </AnimatePresence>
            <span className="h-6 w-0.5 animate-pulse bg-neon" />
          </motion.div>

          <motion.p variants={item} className='mt-6 max-w-xl text-lg leading-relaxed text-muted'>
            {t('home.intro')}
          </motion.p>

          <motion.div variants={item} className='mt-8 flex flex-wrap justify-center gap-3 md:justify-start'>
            <Boton to="/#proyects" size="lg" iconRight={faArrowRight}
              onClick={e => { e.preventDefault(); document.getElementById('proyects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              {t('home.viewProjects')}
            </Boton>
            <Boton href={HDV} download="HojaDeVida_JuanPabloAlvarado.pdf" variant="ghost" size="lg" icon={faDownload}>
              {t('home.downloadCv')}
            </Boton>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex items-center gap-6">
            {/* Dato real calculado desde la base de datos: se oculta mientras carga para no mostrar "0" */}
            {proyectos.length > 0 && (
              <div className="border-r border-white/10 pr-6">
                <p className="font-display text-3xl text-fg">{proyectos.length}<span className="text-neon">+</span></p>
                <p className="text-xs tracking-widest text-subtle uppercase">{t('home.projects')}</p>
              </div>
            )}
            <ul className="flex gap-1">
              {REDES.slice(0, 3).map(red => (
                <li key={red.nombre}>
                  <a href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}
                    className="btn btn-subtle btn-icon text-xl hover:text-neon">
                    <FontAwesomeIcon icon={red.icono} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="anillo-neon aspect-square w-full">
            <picture className="block size-full overflow-hidden rounded-full bg-ink-900">
              <source srcSet={PerfilWeb} type="image/webp" />
              <img className='size-full object-contain object-top' src={Perfil} alt={t('home.photo')} />
            </picture>
          </div>
          {INSIGNIAS.map(({ icono, clase, retardo }) => (
            <span key={icono.iconName} aria-hidden style={{ animationDelay: retardo }}
              className={`glass absolute grid size-14 animate-float place-items-center rounded-2xl text-2xl shadow-xl ${clase}`}>
              <FontAwesomeIcon icon={icono} />
            </span>
          ))}
        </motion.div>
      </div>

      <a href="#about" aria-label={t('home.scrollLabel')}
        onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-widest text-subtle uppercase transition-colors hover:text-neon md:flex">
        {t('home.scroll')}
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <FontAwesomeIcon icon={faArrowDown} />
        </motion.span>
      </a>
    </section>
  )
}

export default Home
