import { useDeferredValue, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus, faUsers } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import Boton from "../../components/Boton"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import { formatoCOP } from "../../helpers/dinero"
import { fechaRelativa } from "../../helpers/fechas"

const Clientes = () => {
  const [params, setParams] = useSearchParams()
  const [texto, setTexto] = useState(params.get('q') ?? '')
  // La búsqueda se hace en el servidor: se espera un momento tras dejar de escribir para no
  // lanzar una petición por cada tecla.
  const diferido = useDeferredValue(texto)
  const [busqueda, setBusqueda] = useState(texto)
  useEffect(() => {
    const id = setTimeout(() => {
      setBusqueda(diferido.trim())
      setParams(diferido.trim() ? { q: diferido.trim() } : {}, { replace: true })
    }, 300)
    return () => clearTimeout(id)
  }, [diferido, setParams])

  const { items, cargando, error, recargar } = useListaAdmin('/admin/clients', busqueda ? { q: busqueda } : {})

  return (
    <>
      <EncabezadoPagina titulo="Clientes" descripcion="Las personas y empresas con las que trabajas. Desde cada cliente ves sus cotizaciones y pagos." />

      <div className="relative mb-4 max-w-md">
        <label htmlFor="buscar-cliente" className="sr-only">Buscar clientes</label>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-subtle" />
        <input id="buscar-cliente" type="search" value={texto} onChange={e => setTexto(e.target.value)}
          placeholder="Buscar por nombre, empresa, correo o teléfono…" className="field py-2 pl-10 text-sm" />
      </div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los clientes" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && <div className="skeleton h-64 rounded-xl" />}

      {!error && !cargando && !items.length && (
        <EstadoVacio icono={faUsers} titulo={busqueda ? 'Sin resultados' : 'Aún no tienes clientes'}
          texto={busqueda ? `Ningún cliente coincide con «${busqueda}».` : 'Crea uno a mano o conviértelo desde un mensaje de contacto (Mensajes → abrir → «Convertir en cliente»).'}>
          {!busqueda && <Boton to="/admin/clientes/nuevo" icon={faPlus}>Nuevo cliente</Boton>}
        </EstadoVacio>
      )}

      {items.length > 0 && (
        <div className="tarjeta overflow-x-auto">
          <table className="tabla min-w-[40rem]">
            <thead>
              <tr><th>Cliente</th><th>Contacto</th><th className="text-right">Cotizaciones</th><th className="text-right">Pagado</th><th className="text-right">Creado</th></tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c._id}>
                  <td>
                    <Link to={`/admin/clientes/${c._id}`} className="font-semibold text-fg hover:text-neon">{c.name}</Link>
                    {c.company && <p className="text-xs text-subtle">{c.company}</p>}
                  </td>
                  <td className="text-muted">
                    {c.email && <p className="truncate">{c.email}</p>}
                    {c.phone && <p className="text-xs text-subtle">{c.phone}</p>}
                  </td>
                  <td className="text-right tabular-nums text-muted">{c.cotizaciones}</td>
                  <td className="text-right tabular-nums text-fg">{formatoCOP(c.pagado)}</td>
                  <td className="text-right text-xs whitespace-nowrap text-subtle">{fechaRelativa(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Clientes
