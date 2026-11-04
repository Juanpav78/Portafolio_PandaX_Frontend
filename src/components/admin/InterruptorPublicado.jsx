// Interruptor "Publicado": oculta un contenido de las webs sin borrarlo. Es un botón con
// role="switch" para que el lector de pantalla anuncie "activado / desactivado".
const InterruptorPublicado = ({ publicado, onChange, cargando = false, conTexto = true, nombre = '' }) => (
  <span className="inline-flex items-center gap-2">
    <button type="button" role="switch" aria-checked={Boolean(publicado)} disabled={cargando}
      aria-label={`Publicado${nombre ? `: ${nombre}` : ''}`}
      title={publicado ? 'Visible en las webs. Click para ocultar' : 'Oculto. Click para publicar'}
      onClick={() => onChange(!publicado)} className="interruptor" />
    {conTexto && <span className={`text-xs font-medium ${publicado ? 'text-success' : 'text-subtle'}`}>{publicado ? 'Publicado' : 'Oculto'}</span>}
  </span>
)

export default InterruptorPublicado
