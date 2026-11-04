import { useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import SelectorSitios from "../../components/admin/SelectorSitios"
import InterruptorPublicado from "../../components/admin/InterruptorPublicado"
import { esSitio } from "../../helpers/sitios"
import { ICONOS_SERVICIO, textoPrecio } from "../../helpers/servicios"

const RUTA = '/admin/services'

// Cómo se muestra el precio en la tarjeta. Se deduce de los datos guardados al editar.
const modoInicial = s => s?.priceLabel ? 'texto' : typeof s?.priceFrom === 'number' ? 'desde' : 'cotizar'

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)

  const [datos, setDatos] = useState({
    title: inicial?.title ?? '',
    slug: inicial?.slug ?? '',
    description: inicial?.description ?? '',
    icon: inicial?.icon ?? 'code',
    priceFrom: inicial?.priceFrom ?? '',
    priceLabelPrefix: inicial?.priceLabelPrefix ?? '',
    priceSuffix: inicial?.priceSuffix ?? '',
    priceLabel: inicial?.priceLabel ?? '',
    order: inicial?.order ?? 0,
  })
  const [modo, setModo] = useState(modoInicial(inicial))
  const [sitios, setSitios] = useState(inicial?.sitios ?? [esSitio(params.get('sitio')) ? params.get('sitio') : 'code'])
  const [publicado, setPublicado] = useState(inicial?.publicado ?? true)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  // Sólo se envían los campos de precio del modo elegido; los demás se vacían para que la web
  // no muestre, por ejemplo, un precio viejo junto a un texto nuevo.
  const precio = {
    priceFrom: modo === 'desde' && datos.priceFrom !== '' ? Number(datos.priceFrom) : null,
    priceLabelPrefix: modo === 'desde' ? datos.priceLabelPrefix : '',
    priceSuffix: modo === 'desde' ? datos.priceSuffix : '',
    priceLabel: modo === 'texto' ? datos.priceLabel : '',
  }

  const validar = () => {
    const e = {}
    if (!datos.title.trim()) e.title = 'El título es obligatorio'
    if (modo === 'desde' && (datos.priceFrom === '' || Number(datos.priceFrom) < 0)) e.priceFrom = 'Escribe el precio en pesos'
    if (modo === 'texto' && !datos.priceLabel.trim()) e.priceLabel = 'Escribe el texto que reemplaza al precio'
    if (!sitios.length) e.sitios = 'Elige al menos un sitio'
    return e
  }

  const enviar = async ev => {
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    const cuerpo = { ...datos, ...precio, order: Number(datos.order) || 0, sitios, publicado }
    try {
      if (editando) await clientAxios.put(`${RUTA}/${inicial._id}`, cuerpo)
      else await clientAxios.post(RUTA, cuerpo)
      mostrarAlerta(editando ? 'Servicio actualizado' : 'Servicio creado', false)
      navigate(sitios.length === 1 ? `/admin/servicios?sitio=${sitios[0]}` : '/admin/servicios')
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar el servicio')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        <section className="tarjeta flex flex-col gap-5 p-6">
          <h2 className="font-semibold text-fg">Información</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo label="Título" id="title" value={datos.title} onChange={cambiar} error={errores.title} placeholder="Landing Pages" />
            <Campo label="Slug (URL)" id="slug" value={datos.slug} onChange={cambiar} placeholder="se genera del título"
              hint="Se usa en el enlace «Cotizar» del formulario." />
          </div>
          <Campo as="textarea" label="Descripción" id="description" rows={3} maxLength={300} value={datos.description} onChange={cambiar}
            placeholder="Qué incluye y para quién es." className="resize-y" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo as="select" label="Icono" id="icon" value={datos.icon} onChange={cambiar}>
              {ICONOS_SERVICIO.map(i => <option key={i.valor} value={i.valor}>{i.nombre}</option>)}
            </Campo>
            <Campo label="Orden" id="order" type="number" value={datos.order} onChange={cambiar} hint="Menor número = aparece antes." />
          </div>
        </section>

        <section className="tarjeta flex flex-col gap-5 p-6">
          <h2 className="font-semibold text-fg">Precio</h2>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Cómo mostrar el precio">
            {[['desde', 'Precio desde'], ['texto', 'Texto en lugar del precio'], ['cotizar', 'Sin precio']].map(([valor, texto]) => (
              <button key={valor} type="button" role="radio" aria-checked={modo === valor} aria-pressed={modo === valor}
                className="chip-filtro" onClick={() => setModo(valor)}>{texto}</button>
            ))}
          </div>
          {modo === 'desde' && (
            <div className="grid gap-5 sm:grid-cols-3">
              <Campo label="Prefijo" id="priceLabelPrefix" value={datos.priceLabelPrefix} onChange={cambiar} placeholder="Desde" />
              <Campo label="Precio (COP)" id="priceFrom" type="number" min="0" step="1000" value={datos.priceFrom} onChange={cambiar} error={errores.priceFrom} placeholder="600000" />
              <Campo label="Sufijo" id="priceSuffix" value={datos.priceSuffix} onChange={cambiar} placeholder="/mes" />
            </div>
          )}
          {modo === 'texto' && (
            <Campo label="Texto" id="priceLabel" value={datos.priceLabel} onChange={cambiar} error={errores.priceLabel} placeholder="A la medida de tu proyecto" />
          )}
          <p className="rounded-lg bg-ink-700 px-3 py-2 text-sm text-muted">
            En la tarjeta se verá: <strong className="text-fg">{textoPrecio(precio)}</strong>
          </p>
        </section>
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-22 lg:self-start">
        <section className="tarjeta flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-fg">Publicación</h2>
            <InterruptorPublicado publicado={publicado} onChange={setPublicado} />
          </div>
          <SelectorSitios valor={sitios} onChange={setSitios} error={errores.sitios} publicado={publicado} tipo="El servicio" />
        </section>
        <div className="flex gap-3">
          <Boton to="/admin/servicios" variant="ghost">Cancelar</Boton>
          <Boton type="submit" loading={enviando} icon={faFloppyDisk} className="flex-1">
            {editando ? 'Guardar cambios' : 'Crear servicio'}
          </Boton>
        </div>
      </aside>
    </form>
  )
}

const ServicioForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `${RUTA}/${id}` : null)

  return (
    <>
      <EncabezadoAdmin etiqueta="Servicios" titulo={id ? (doc?.title ?? 'Editar servicio') : 'Nuevo servicio'}
        volver={{ to: '/admin/servicios', texto: 'Servicios' }} />
      {cargando && <div className="skeleton h-96 rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró el servicio" texto={error}><Boton to="/admin/servicios" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={doc?._id ?? 'nuevo'} inicial={doc} />}
    </>
  )
}

export default ServicioForm
