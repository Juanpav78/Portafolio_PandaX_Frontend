import { nombreSitio } from "../../helpers/sitios"

// Etiqueta de color por sitio (colores en admin.css). Se usa igual en tablas, filtros y formularios
// para que "verde azulado = PandaX Code" y "violeta = Portafolio" se aprenda una sola vez.
const BadgeSitio = ({ sitio }) => <span className="badge-sitio" data-sitio={sitio}>{nombreSitio(sitio)}</span>

export const BadgesSitios = ({ sitios = [] }) => (
  <span className="inline-flex flex-wrap gap-1">
    {sitios.length ? sitios.map(s => <BadgeSitio key={s} sitio={s} />) : <span className="text-xs text-subtle">Sin sitio</span>}
  </span>
)

export default BadgeSitio
