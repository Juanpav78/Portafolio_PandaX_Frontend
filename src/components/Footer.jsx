import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router"
import { REDES } from "../helpers/redes"
import useIdioma from "../hooks/useIdioma"
import Logo from "../assets/PandaX_White.svg"

// Se calcula una vez al cargar el módulo: el año no cambia durante una visita y así el render
// se mantiene puro (las reglas de React Compiler marcan new Date() dentro de componentes).
const ANIO = new Date().getFullYear()

const Footer = () => {
  const { t } = useIdioma()
  return (
    <footer className='relative border-t border-white/5 bg-ink-950/60'>
      {/* Línea neón superior que "ilumina" el borde del footer */}
      <div className="absolute inset-x-0 -top-px mx-auto h-px max-w-3xl bg-linear-to-r from-transparent via-neon to-transparent" />
      <div className='mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between'>
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="" className="w-9" />
            <span className="font-display text-xl text-fg">PandaX<span className="neon-text">{"/>"}</span></span>
          </Link>
          <p className="max-w-xs text-center text-sm text-muted md:text-left">
            {t('footer.tagline')}
          </p>
        </div>

        <ul className='flex gap-2'>
          {REDES.map(red => (
            <li key={red.nombre}>
              <a href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}
                className="grid size-11 place-items-center rounded-xl border border-white/10 text-lg text-muted transition-all
                  hover:-translate-y-1 hover:border-neon/60 hover:text-neon hover:shadow-[0_0_20px_-6px_var(--color-neon)]">
                <FontAwesomeIcon icon={red.icono} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className='border-t border-white/5 py-6 text-center font-mono text-xs text-subtle'>
        © {ANIO} Juan Alvarado · PandaXcode
      </p>
    </footer>
  )
}

export default Footer
