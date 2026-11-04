import { useState } from "react"
import { useOutletContext } from "react-router"
import { faArrowRightFromBracket, faKey, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useAuth from "../../hooks/useAuth"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"

const MIN_PASSWORD = 8 // mismo mínimo que valida el backend

const vacio = { actual: '', nuevo: '', confirmar: '' }

const CambiarPassword = () => {
  const { mostrarAlerta } = useProyectos()
  const [datos, setDatos] = useState(vacio)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  const enviar = async ev => {
    ev.preventDefault()
    const e = {}
    if (!datos.actual) e.actual = 'Escribe tu contraseña actual'
    if (datos.nuevo.length < MIN_PASSWORD) e.nuevo = `Mínimo ${MIN_PASSWORD} caracteres`
    else if (datos.nuevo === datos.actual) e.nuevo = 'Debe ser distinta de la actual'
    if (datos.confirmar !== datos.nuevo) e.confirmar = 'No coincide con la nueva contraseña'
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    try {
      const { data } = await clientAxios.put('/admin/password', { actual: datos.actual, nuevo: datos.nuevo })
      mostrarAlerta(data.msg, false)
      setDatos(vacio)
    } catch (error) {
      const msg = error.response?.data?.msg ?? 'No se pudo cambiar la contraseña'
      // El error más común es la contraseña actual: se marca en su campo, no sólo en el toast
      if (error.response?.status === 403) setErrores({ actual: msg })
      else mostrarAlerta(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
      <Campo label="Contraseña actual" id="actual" type="password" autoComplete="current-password" value={datos.actual} onChange={cambiar} error={errores.actual} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nueva contraseña" id="nuevo" type="password" autoComplete="new-password" value={datos.nuevo} onChange={cambiar} error={errores.nuevo}
          hint={`Mínimo ${MIN_PASSWORD} caracteres.`} />
        <Campo label="Confirmar nueva contraseña" id="confirmar" type="password" autoComplete="new-password" value={datos.confirmar} onChange={cambiar} error={errores.confirmar} />
      </div>
      <div><Boton type="submit" icon={faKey} loading={enviando}>Cambiar contraseña</Boton></div>
    </form>
  )
}

const Seccion = ({ titulo, descripcion, children }) => (
  <section className="tarjeta grid gap-6 p-6 md:grid-cols-[14rem_minmax(0,1fr)]">
    <div>
      <h2 className="font-semibold text-fg">{titulo}</h2>
      {descripcion && <p className="mt-1 text-sm text-muted">{descripcion}</p>}
    </div>
    <div>{children}</div>
  </section>
)

const Configuracion = () => {
  const { auth, cerrarSesion } = useAuth()
  const { tema, setTema } = useOutletContext()

  return (
    <>
      <EncabezadoPagina titulo="Configuración" descripcion="Tu cuenta de administrador y preferencias del panel." />
      <div className="flex flex-col gap-4">
        <Seccion titulo="Usuario" descripcion="El panel tiene un único administrador; el registro de cuentas está cerrado.">
          <dl className="grid gap-4 sm:grid-cols-3">
            <div><dt className="text-xs font-medium text-subtle">Nombre</dt><dd className="mt-0.5 text-sm text-fg">{auth.nombre}</dd></div>
            <div><dt className="text-xs font-medium text-subtle">Correo</dt><dd className="mt-0.5 truncate text-sm text-fg">{auth.email}</dd></div>
            <div><dt className="text-xs font-medium text-subtle">Rol</dt><dd className="mt-0.5 text-sm text-fg capitalize">{auth.rol ?? 'admin'}</dd></div>
          </dl>
        </Seccion>

        <Seccion titulo="Contraseña" descripcion="Cámbiala si crees que alguien más la conoce.">
          <CambiarPassword />
        </Seccion>

        <Seccion titulo="Apariencia" descripcion="Sólo afecta al panel en este navegador; las webs públicas no cambian.">
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tema del panel">
            {[['claro', 'Claro', faSun], ['oscuro', 'Oscuro', faMoon]].map(([valor, texto, icono]) => (
              <Boton key={valor} variant={tema === valor ? 'primary' : 'ghost'} icon={icono} role="radio" aria-checked={tema === valor}
                onClick={() => setTema(valor)}>{texto}</Boton>
            ))}
          </div>
        </Seccion>

        <Seccion titulo="Sesión" descripcion="La sesión dura 30 días en este navegador.">
          <Boton variant="ghost" icon={faArrowRightFromBracket} onClick={cerrarSesion}>Cerrar sesión</Boton>
        </Seccion>
      </div>
    </>
  )
}

export default Configuracion
