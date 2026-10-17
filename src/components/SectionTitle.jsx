import { motion } from "framer-motion"

// Encabezado común de las secciones públicas: etiqueta tipo comentario de código + título
// con la palabra destacada en neón. `as` permite usar h1 en páginas propias y h2 en secciones.
const SectionTitle = ({ etiqueta, titulo, destacado, descripcion, as: Tag = 'h2', centrado = true }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`mb-12 flex flex-col gap-3 ${centrado ? 'items-center text-center' : ''}`}
    >
      <span className="font-mono text-sm text-neon">{`// ${etiqueta}`}</span>
      <Tag className="font-display text-4xl text-fg md:text-6xl">
        {titulo} <span className="neon-text">{destacado}</span>
      </Tag>
      {descripcion && <p className="max-w-2xl text-lg text-muted">{descripcion}</p>}
    </motion.header>
  )
}

export default SectionTitle
