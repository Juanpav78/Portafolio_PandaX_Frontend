import { faGithub, faInstagram, faLinkedin, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

// Fuente única de los enlaces sociales: Header, About, Contact y Footer leen de aquí,
// así un cambio de usuario o número se hace en un solo sitio.
export const REDES = [
  { nombre: 'GitHub', url: 'https://github.com/Juanpav78', icono: faGithub },
  { nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/juanpavpandax/', icono: faLinkedin },
  { nombre: 'Instagram', url: 'https://www.instagram.com/pandaxcode/', icono: faInstagram },
  { nombre: 'YouTube', url: 'https://www.youtube.com/@pandaxcode9228', icono: faYoutube },
  { nombre: 'WhatsApp', url: 'https://wa.me/573224081829', icono: faWhatsapp },
]

export const WHATSAPP = REDES.find(red => red.nombre === 'WhatsApp').url
