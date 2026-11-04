import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../config/clientAxios"
import SectionTitle from "../components/SectionTitle"
import useIdioma from "../hooks/useIdioma"

const SITIO = import.meta.env.VITE_SITE || 'portafolio'

// Testimonios marcados para el portafolio en el admin. La sección entera se oculta mientras no
// haya ninguno (o si la API falla): un bloque vacío de "testimonios" resta más de lo que suma.
const Testimonios = () => {
  const [testimonios, setTestimonios] = useState([])
  const { t } = useIdioma()

  useEffect(() => {
    let activo = true
    clientAxios('/testimonials', { params: { site: SITIO } })
      .then(({ data }) => activo && setTestimonios(Array.isArray(data) ? data : []))
      .catch(() => {})
    return () => { activo = false }
  }, [])

  if (!testimonios.length) return null

  return (
    <section className="scroll-mt-20 px-4 py-24 sm:px-6" id="testimonios">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          etiqueta={t('testimonials.label')}
          titulo={t('testimonials.title')}
          destacado={t('testimonials.highlight')}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((item, i) => (
            <motion.figure
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass flex flex-col gap-4 rounded-2xl p-6"
            >
              <FontAwesomeIcon icon={faQuoteLeft} className="text-2xl text-neon" aria-hidden />
              <blockquote className="flex-1 text-muted">{item.text}</blockquote>
              <figcaption>
                <p className="font-bold text-fg">{item.name}</p>
                {(item.role || item.company) && (
                  <p className="text-sm text-subtle">{[item.role, item.company].filter(Boolean).join(' · ')}</p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonios
