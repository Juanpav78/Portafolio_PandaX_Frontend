import { useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

// Paleta del panda rojo, aparte de los tokens del sitio porque son colores de ilustración
const C = {
  pelaje: '#d4572b',
  pelajeClaro: '#e8743f',
  oscuro: '#2b130d',
  marron: '#7a2e1a',
  blanco: '#fbf3ea',
  papel: '#f1dfbd',
}

const PREGUNTAS = [
  { x: 120, delay: 0, color: 'var(--color-neon-amber)', size: 34 },
  { x: 200, delay: 0.9, color: 'var(--color-neon)', size: 44 },
  { x: 280, delay: 1.8, color: 'var(--color-neon-pink)', size: 30 },
]

// Ojo con pupila que sigue al cursor y parpadeo cada pocos segundos (scaleY casi a 0).
// Fuera de PandaPerdido para que React no lo remonte (y reinicie el parpadeo) en cada render.
const Ojo = ({ cx, retardo, pupilaX, pupilaY }) => (
  <motion.g
    style={{ transformOrigin: `${cx}px 172px` }}
    animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
    transition={{ duration: 4, times: [0, 0.9, 0.93, 0.96, 1], repeat: Infinity, delay: retardo }}
  >
    <ellipse cx={cx} cy={172} rx={17} ry={19} fill={C.oscuro} />
    <motion.g style={{ x: pupilaX, y: pupilaY }}>
      <circle cx={cx + 4} cy={166} r={6} fill={C.blanco} />
      <circle cx={cx - 5} cy={178} r={2.5} fill={C.blanco} opacity={0.7} />
    </motion.g>
  </motion.g>
)

// Ilustración animada del 404: un panda rojo perdido con un mapa al revés.
// Todo es SVG en línea (sin imágenes que descargar) y escala con su contenedor.
const PandaPerdido = ({ className = '' }) => {
  // Posición del cursor normalizada a -1…1 respecto al centro de la ventana. Los ojos la siguen
  // con un muelle (useSpring) para que el movimiento sea suave y no robótico.
  const ratonX = useMotionValue(0)
  const ratonY = useMotionValue(0)
  const suaveX = useSpring(ratonX, { stiffness: 120, damping: 15 })
  const suaveY = useSpring(ratonY, { stiffness: 120, damping: 15 })
  const pupilaX = useTransform(suaveX, v => v * 5)
  const pupilaY = useTransform(suaveY, v => v * 4)

  useEffect(() => {
    const mover = e => {
      ratonX.set((e.clientX / window.innerWidth) * 2 - 1)
      ratonY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', mover)
    return () => window.removeEventListener('pointermove', mover)
  }, [ratonX, ratonY])

  return (
    <svg viewBox="0 0 400 420" className={className} role="img" aria-label="Un panda rojo perdido mirando un mapa al revés">
      <defs>
        <radialGradient id="brillo-panda" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-neon)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-neon)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo neón detrás del panda */}
      <circle cx="200" cy="230" r="190" fill="url(#brillo-panda)" />

      {/* Sombra en el suelo: se encoge cuando el panda "sube" al respirar */}
      <motion.ellipse cx="200" cy="392" rx="120" ry="14" fill="#000" opacity="0.45"
        animate={{ rx: [120, 110, 120] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Signos de interrogación que suben y se desvanecen, escalonados */}
      {PREGUNTAS.map(({ x, delay, color, size }) => (
        <motion.text
          key={x}
          x={x} y={70}
          textAnchor="middle"
          fontFamily="Righteous, cursive"
          fontSize={size}
          fill={color}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -15, -30] }}
          transition={{ duration: 2.7, delay, repeat: Infinity, ease: 'easeOut' }}
        >?</motion.text>
      ))}

      {/* Todo el cuerpo "respira": sube y baja un par de píxeles */}
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Cola anillada: un trazo grueso naranja y encima el mismo trazo oscuro con guiones,
            que dibujan los anillos. Gira desde su base para "barrer" de lado a lado. */}
        <motion.g
          style={{ transformOrigin: '255px 330px' }}
          animate={{ rotate: [-6, 10, -6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M250 335 C 330 335, 375 270, 345 195" stroke={C.pelaje} strokeWidth="46" strokeLinecap="round" fill="none" />
          <path d="M250 335 C 330 335, 375 270, 345 195" stroke={C.marron} strokeWidth="46" strokeDasharray="16 22" strokeDashoffset="-10" fill="none" />
        </motion.g>

        {/* Cuerpo */}
        <ellipse cx="200" cy="315" rx="82" ry="72" fill={C.pelaje} />
        <ellipse cx="200" cy="332" rx="54" ry="52" fill={C.oscuro} />
        {/* Patas */}
        <ellipse cx="160" cy="382" rx="28" ry="17" fill={C.oscuro} />
        <ellipse cx="240" cy="382" rx="28" ry="17" fill={C.oscuro} />

        {/* Mapa al revés (la "N" está abajo), sujetado por las patas delanteras */}
        <motion.g
          style={{ transformOrigin: '200px 318px' }}
          animate={{ rotate: [-4, 3, -4] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M138 292 L178 298 L222 290 L262 298 L262 350 L222 342 L178 350 L138 344 Z" fill={C.papel} stroke="#c9b48c" strokeWidth="2" />
          <path d="M178 298 L178 350 M222 290 L222 342" stroke="#c9b48c" strokeWidth="2" />
          <path d="M150 335 C 170 310, 195 340, 215 318 S 245 310, 250 330" stroke="var(--color-neon-pink)" strokeWidth="2.5" strokeDasharray="5 5" fill="none" />
          <path d="M244 324 l8 8 m0 -8 l-8 8" stroke="var(--color-danger)" strokeWidth="3" strokeLinecap="round" />
          <text x="157" y="312" fontSize="12" fontWeight="bold" fill={C.marron} transform="rotate(180 157 308)">N</text>
          {/* Patas sobre las esquinas del mapa */}
          <ellipse cx="140" cy="318" rx="16" ry="20" fill={C.oscuro} />
          <ellipse cx="260" cy="318" rx="16" ry="20" fill={C.oscuro} />
        </motion.g>

        {/* Cabeza: se inclina de un lado a otro, como buscando por dónde ir */}
        <motion.g
          style={{ transformOrigin: '200px 240px' }}
          animate={{ rotate: [-7, 7, 7, -7, -7] }}
          transition={{ duration: 5, times: [0, 0.3, 0.5, 0.8, 1], repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Orejas */}
          <path d="M112 140 Q 100 80, 150 92 Q 140 120, 112 140 Z" fill={C.pelaje} />
          <path d="M120 128 Q 115 95, 142 100 Q 135 118, 120 128 Z" fill={C.blanco} />
          <path d="M288 140 Q 300 80, 250 92 Q 260 120, 288 140 Z" fill={C.pelaje} />
          <path d="M280 128 Q 285 95, 258 100 Q 265 118, 280 128 Z" fill={C.blanco} />

          {/* Cabeza */}
          <ellipse cx="200" cy="178" rx="98" ry="80" fill={C.pelajeClaro} />
          {/* Cejas y mejillas blancas, características del panda rojo */}
          <ellipse cx="160" cy="140" rx="20" ry="11" fill={C.blanco} transform="rotate(-12 160 140)" />
          <ellipse cx="240" cy="140" rx="20" ry="11" fill={C.blanco} transform="rotate(12 240 140)" />
          <ellipse cx="135" cy="200" rx="34" ry="28" fill={C.blanco} />
          <ellipse cx="265" cy="200" rx="34" ry="28" fill={C.blanco} />
          {/* "Lágrimas" marrones que bajan desde los ojos */}
          <path d="M158 186 Q 150 215, 160 240" stroke={C.marron} strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M242 186 Q 250 215, 240 240" stroke={C.marron} strokeWidth="14" strokeLinecap="round" fill="none" />
          {/* Hocico */}
          <ellipse cx="200" cy="212" rx="38" ry="28" fill={C.blanco} />

          <Ojo cx={162} retardo={0} pupilaX={pupilaX} pupilaY={pupilaY} />
          <Ojo cx={238} retardo={0.05} pupilaX={pupilaX} pupilaY={pupilaY} />

          {/* Nariz y boca preocupada */}
          <path d="M189 200 Q 200 194, 211 200 Q 206 210, 200 211 Q 194 210, 189 200 Z" fill={C.oscuro} />
          <path d="M186 226 Q 193 220, 200 226 Q 207 220, 214 226" stroke={C.oscuro} strokeWidth="3" strokeLinecap="round" fill="none" />
        </motion.g>
      </motion.g>
    </svg>
  )
}

export default PandaPerdido
