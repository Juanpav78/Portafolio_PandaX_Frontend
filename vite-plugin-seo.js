// Plugin de Vite para lo que los buscadores y las redes necesitan con URL absoluta:
//  - etiquetas para compartir (og:image, og:url, twitter:card y canonical) en index.html
//  - robots.txt y sitemap.xml generados al compilar
// Todo depende de VITE_SITE_URL (p. ej. https://midominio.com). Si no está definida, sólo se
// genera un robots.txt sin sitemap: una URL relativa no le sirve ni a Google ni a WhatsApp.
export default function seo({ rutas = ['/'], imagen = '/og-image.jpg', bloquear = [] } = {}) {
  let sitio = ''

  return {
    name: 'seo-propio',

    configResolved(config) {
      sitio = (config.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
    },

    transformIndexHtml() {
      if (!sitio) return []
      const meta = (atributos) => ({ tag: 'meta', attrs: atributos, injectTo: 'head' })
      return [
        meta({ property: 'og:url', content: `${sitio}/` }),
        meta({ property: 'og:image', content: `${sitio}${imagen}` }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:image', content: `${sitio}${imagen}` }),
        { tag: 'link', attrs: { rel: 'canonical', href: `${sitio}/` }, injectTo: 'head' },
      ]
    },

    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...bloquear.map((ruta) => `Disallow: ${ruta}`)]
      if (sitio) robots.push('', `Sitemap: ${sitio}/sitemap.xml`)
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })

      if (!sitio) return
      const hoy = new Date().toISOString().slice(0, 10)
      const urls = rutas
        .map((ruta) => `  <url><loc>${sitio}${ruta}</loc><lastmod>${hoy}</lastmod></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}
