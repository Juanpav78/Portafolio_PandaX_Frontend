import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { faCircleCheck, faDownload, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import Boton from "../components/Boton"
import Campo from "../components/Campo"
import SectionTitle from "../components/SectionTitle"
import clientAxios from "../config/clientAxios"
import useIdioma from "../hooks/useIdioma"
import { REDES, WHATSAPP } from "../helpers/redes"
import Coffe from '../assets/coffe.png'
import CoffeWeb from '../build/images/coffe.webp'
import HDV from '../assets/HDV_JuanPAV_2026.pdf'

const VACIO = { nombre: '', email: '', mensaje: '', sitio: '' }
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Misma validación que el backend: así el visitante ve el error al momento sin esperar la red.
// Devuelve las claves de los campos con error (el texto traducido se busca con t()).
const validar = ({ nombre, email, mensaje }) => {
  const errores = {}
  if (nombre.trim().length < 2) errores.nombre = true
  if (!EMAIL_VALIDO.test(email.trim())) errores.email = true
  if (mensaje.trim().length < 10) errores.mensaje = true
  return errores
}

const FormularioContacto = () => {
  const { t } = useIdioma()
  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  // 'inactivo' | 'enviando' | 'enviado'; el error general se guarda aparte para poder reintentar
  const [estado, setEstado] = useState('inactivo')
  const [errorGeneral, setErrorGeneral] = useState('')

  const cambiar = e => {
    const nuevo = { ...form, [e.target.name]: e.target.value }
    setForm(nuevo)
    // Un campo con error se revalida al escribir para que el aviso desaparezca al corregirlo
    if (errores[e.target.name]) setErrores(validar(nuevo))
  }

  const enviar = async e => {
    e.preventDefault()
    const nuevos = validar(form)
    setErrores(nuevos)
    const primero = Object.keys(nuevos)[0]
    if (primero) return document.getElementById(`contacto-${primero}`)?.focus()

    setEstado('enviando')
    setErrorGeneral('')
    try {
      await clientAxios.post('/contacto', form)
      setEstado('enviado')
      setForm(VACIO)
    } catch (error) {
      // 429 = límite de envíos alcanzado; cualquier otro fallo usa el mensaje genérico
      setErrorGeneral(t(error.response?.status === 429 ? 'contact.form.errors.limite' : 'contact.form.errors.error'))
      setEstado('inactivo')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {estado === 'enviado' ? (
        <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          role="status" className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
          <FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-success drop-shadow-[0_0_20px_rgba(61,255,176,0.5)]" />
          <p className="max-w-xs text-lg font-semibold text-fg">{t('contact.form.success')}</p>
          <Boton variant="ghost" onClick={() => setEstado('inactivo')}>{t('contact.form.another')}</Boton>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} onSubmit={enviar} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label={t('contact.form.name')} id="contacto-nombre" name="nombre" autoComplete="name" maxLength={80}
              placeholder={t('contact.form.namePh')} value={form.nombre} onChange={cambiar}
              error={errores.nombre && t('contact.form.errors.nombre')} />
            <Campo label={t('contact.form.email')} id="contacto-email" name="email" type="email" autoComplete="email"
              placeholder={t('contact.form.emailPh')} value={form.email} onChange={cambiar}
              error={errores.email && t('contact.form.errors.email')} />
          </div>
          <Campo as="textarea" label={t('contact.form.message')} id="contacto-mensaje" name="mensaje" rows={5} maxLength={2000}
            placeholder={t('contact.form.messagePh')} value={form.mensaje} onChange={cambiar} className="resize-y"
            error={errores.mensaje && t('contact.form.errors.mensaje')} />

          {/* Honeypot anti-spam: invisible y fuera del orden de tabulación, así ninguna persona
              lo rellena; los bots que completan todos los campos sí, y el backend los descarta. */}
          <input type="text" name="sitio" value={form.sitio} onChange={cambiar} tabIndex={-1} autoComplete="off"
            aria-hidden="true" className="pointer-events-none absolute top-0 left-0 size-px opacity-0" />

          {errorGeneral && <p role="alert" className="text-sm font-semibold text-danger">{errorGeneral}</p>}

          <Boton type="submit" size="lg" icon={faPaperPlane} loading={estado === 'enviando'} className="sm:self-start">
            {t('contact.form.send')}
          </Boton>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

const Contact = () => {
  const { t } = useIdioma()

  return (
    <section className='scroll-mt-20 px-4 py-24 sm:px-6' id="contact">
      <div className="mx-auto max-w-6xl">
        <SectionTitle etiqueta={t('contact.label')} titulo={t('contact.title')} destacado={t('contact.highlight')} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          // overflow-clip (no hidden): recorta el halo decorativo sin convertir la tarjeta en un
          // contenedor desplazable; con hidden, enfocar un campo podía desplazarla en horizontal
          className="glass neon-border neon-glow relative overflow-clip rounded-3xl p-6 sm:p-10"
        >
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-neon/20 blur-[100px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <picture>
                <source srcSet={CoffeWeb} type="image/webp" />
                <img className='w-32 animate-float drop-shadow-[0_0_30px_rgba(255,106,61,0.35)]' src={Coffe} alt="" />
              </picture>
              <h3 className="mt-6 font-display text-3xl text-fg">{t('contact.heading')}</h3>
              <p className='mt-3 text-lg text-muted'>{t('contact.text')}</p>

              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Boton href={WHATSAPP} variant="ghost" icon={faWhatsapp}>{t('contact.whatsapp')}</Boton>
                <Boton href={HDV} download="HojaDeVida_JuanPabloAlvarado.pdf" variant="ghost" icon={faDownload}>{t('contact.cv')}</Boton>
              </div>

              <ul className='mt-6 flex gap-2'>
                {REDES.filter(red => red.nombre !== 'WhatsApp').map(red => (
                  <li key={red.nombre}>
                    <a href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}
                      className="btn btn-subtle btn-icon text-xl hover:text-neon">
                      <FontAwesomeIcon icon={red.icono} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/5 bg-ink-900/60 p-5 sm:p-6">
              <FormularioContacto />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
