import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

const VARIANTES = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  subtle: 'btn-subtle',
  danger: 'btn-danger',
}

const TAMANOS = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', icon: 'btn-icon' }

// Un único componente para todo lo que se ve como botón. La etiqueta se elige por las props:
//  - `to`   → <Link> de React Router (navegación interna sin recargar la página)
//  - `href` → <a> (enlaces externos y descargas; los externos abren en pestaña nueva)
//  - nada   → <button> (acciones; type="button" por defecto para no enviar formularios sin querer)
const Boton = ({
  to, href, variant = 'primary', size = 'md',
  icon, iconRight, loading = false,
  className = '', children, type = 'button', ...props
}) => {
  const clases = `btn ${VARIANTES[variant]} ${TAMANOS[size]} ${className}`
  const contenido = (
    <>
      {loading
        ? <FontAwesomeIcon icon={faSpinner} spin />
        : icon && <FontAwesomeIcon icon={icon} />}
      {children}
      {iconRight && <FontAwesomeIcon icon={iconRight} className="text-[0.85em]" />}
    </>
  )

  if (to) return <Link to={to} className={clases} {...props}>{contenido}</Link>

  if (href) {
    // noopener evita que la pestaña abierta pueda controlar esta vía window.opener
    const externo = !props.download && /^https?:/.test(href)
    return (
      <a href={href} className={clases}
        {...(externo && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}>
        {contenido}
      </a>
    )
  }

  return (
    <button type={type} className={clases} disabled={loading || props.disabled} aria-busy={loading} {...props}>
      {contenido}
    </button>
  )
}

export default Boton
