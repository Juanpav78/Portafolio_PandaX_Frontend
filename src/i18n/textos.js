// Textos del sitio público en español e inglés. El panel de admin sólo está en español.
// Las claves deben existir en ambos idiomas; si falta alguna, t() devuelve la propia clave
// para que el hueco se note en pantalla en vez de mostrarse vacío.
// **texto** se pinta en negrita (ver conNegritas en IdiomaProvider).
export const TEXTOS = {
  es: {
    nav: {
      home: 'Inicio', about: 'Sobre mí', projects: 'Proyectos', contact: 'Contacto', allWork: 'Todo',
      talk: 'Hablemos', admin: 'Admin', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', skip: 'Saltar al contenido',
      main: 'Principal', language: 'Idioma',
    },
    home: {
      available: 'Disponible para freelance',
      hi: 'Hola, soy',
      roles: ['Desarrollador Full-Stack', 'React · Node.js', 'Datos y automatización'],
      intro: 'Construyo aplicaciones web y herramientas que automatizan procesos y aprovechan los datos, cuidando cada detalle.',
      viewProjects: 'Ver proyectos',
      downloadCv: 'Descargar CV',
      projects: 'Proyectos',
      scroll: 'Bajar',
      scrollLabel: 'Bajar a la sección Sobre mí',
      photo: 'Juan Alvarado, desarrollador web',
    },
    about: {
      label: 'sobre mí', title: 'Quién', highlight: 'soy',
      paragraphs: [
        'Hola, soy **Juan Pablo**. Soy **desarrollador full-stack** con experiencia creando aplicaciones web, automatizando procesos y trabajando con datos.',
        'Hoy trabajo como **auxiliar de bases de datos en Autocolombiana**, donde desarrollé una aplicación web para gestionar y analizar inventarios con JavaScript, Python e inteligencia artificial.',
        'Estudio **Tecnología en Desarrollo de Software** en la UNAD y me apasiona aprender de forma continua: ahora mismo estoy estudiando **inglés y francés**.',
        'Me considero creativo, proactivo y muy bueno resolviendo problemas. Fuera del código disfruto el deporte y las series.',
      ],
      traits: [
        { titulo: 'Full-stack', texto: 'Especializado en frontend' },
        { titulo: 'Datos e IA', texto: 'Automatizo procesos' },
        { titulo: 'Creativo', texto: 'Resuelvo problemas' },
        { titulo: 'Siempre aprendiendo', texto: 'Ahora: inglés y francés' },
      ],
      stack: 'Tecnologías',
    },
    journey: {
      label: 'trayectoria', title: 'Mi', highlight: 'trayectoria',
      work: 'Experiencia', education: 'Educación', languages: 'Idiomas', cv: 'Descargar hoja de vida',
      jobs: [
        {
          puesto: 'Auxiliar de bases de datos', empresa: 'Autocolombiana', fecha: 'Dic 2025 – Actualidad', actual: true,
          puntos: [
            'Desarrollé una aplicación web para la gestión y análisis de inventarios (ERP y e-commerce) con JavaScript, Python e inteligencia artificial.',
            'Participé en la reclasificación y estandarización de la información de productos en el ERP.',
            'Apliqué IA tanto en el desarrollo de software como en la optimización del análisis de datos.',
          ],
        },
        {
          puesto: 'Auxiliar de bases de datos', empresa: 'Autogermana', fecha: 'Ago 2023 – Nov 2025',
          puntos: [
            'Administré y estructuré información para catálogos digitales, garantizando su calidad y consistencia.',
            'Organicé información de productos (SKU, referencias, categorías y atributos) en plataformas corporativas.',
            'Desarrollé herramientas en Excel y VBA para automatizar la creación y actualización masiva de información.',
          ],
        },
      ],
      studies: [
        {
          titulo: 'Tecnología en Desarrollo de Software', lugar: 'Universidad Nacional Abierta y a Distancia (UNAD)', fecha: '2024 – 2027',
          texto: 'Requerimientos, desarrollo de software, bases de datos y pruebas funcionales y de calidad.',
        },
      ],
      langs: [
        { nombre: 'Español', nivel: 'Nativo' },
        { nombre: 'Inglés', nivel: 'Estudiando' },
        { nombre: 'Francés', nivel: 'Estudiando' },
      ],
    },
    projects: {
      label: 'trabajo seleccionado', title: 'Proyectos', highlight: 'destacados',
      description: 'Una selección de lo que he construido. Haz click en una tarjeta para ver los detalles.',
      seeAll: 'Ver los {n} proyectos',
    },
    portfolio: {
      label: 'portafolio', title: 'Todos los', highlight: 'proyectos',
      description: 'Busca por nombre, tecnología o tipo de proyecto.',
      search: 'Buscar proyectos…', searchLabel: 'Buscar proyectos',
      allTech: 'Todas las tecnologías', techLabel: 'Filtrar por tecnología', sortLabel: 'Ordenar', typeLabel: 'Filtrar por tipo',
      all: 'Todos',
      showing: 'Mostrando **{a}** de {b} proyectos',
      clear: 'Limpiar filtros',
      emptyTitle: 'Ningún proyecto coincide con tu búsqueda',
      emptyText: 'Prueba con otra palabra o quita algunos filtros.',
      sort: { destacados: 'Destacados primero', recientes: 'Más recientes', antiguos: 'Más antiguos', nombre: 'Nombre (A–Z)' },
    },
    gallery: {
      error: 'No se pudieron cargar los proyectos ahora mismo.',
      retry: 'Reintentar',
      waking: 'Despertando el servidor: la primera visita puede tardar unos segundos.',
    },
    card: { details: 'Ver detalles de {nombre}', techs: 'Tecnologías', featured: 'Destacado', photos: '{n} imágenes', screenshot: 'Captura del proyecto {nombre}' },
    detail: {
      visit: 'Visitar sitio', source: 'Código fuente', stack: 'Stack',
      challenge: 'El problema', solution: 'La solución',
      prevImage: 'Imagen anterior', nextImage: 'Imagen siguiente', goToImage: 'Ver imagen {n}',
    },
    modal: { prev: 'Proyecto anterior', next: 'Proyecto siguiente', close: 'Cerrar' },
    contact: {
      label: 'contacto', title: 'Trabajemos', highlight: 'juntos',
      heading: '¿Tienes un proyecto en mente?',
      text: 'Escríbeme por el formulario, por WhatsApp o en redes. Tomemos un café y construyamos algo juntos.',
      whatsapp: 'WhatsApp', cv: 'Mi CV',
      form: {
        name: 'Nombre', email: 'Email', message: 'Mensaje',
        namePh: 'Tu nombre', emailPh: 'tu@email.com', messagePh: 'Cuéntame sobre tu proyecto…',
        send: 'Enviar mensaje',
        success: '¡Mensaje enviado! Te responderé lo antes posible.',
        another: 'Enviar otro mensaje',
        errors: {
          nombre: 'Escribe tu nombre',
          email: 'Escribe un email válido',
          mensaje: 'El mensaje debe tener al menos 10 caracteres',
          limite: 'Has enviado varios mensajes seguidos. Inténtalo en unos minutos.',
          error: 'No se pudo enviar. Inténtalo de nuevo o escríbeme por WhatsApp.',
        },
      },
    },
    footer: { tagline: 'Construyo experiencias web rápidas y cuidadas que representan tu marca.' },
    notFound: {
      label: '// página no encontrada',
      title: 'Te perdiste…', highlight: 'igual que él',
      text: 'Nuestro panda rojo lleva un rato mirando el mapa y tampoco encuentra esta página. Puede que se haya movido o que el enlace esté mal escrito.',
      home: 'Volver al inicio', projects: 'Ver proyectos', back: 'Atrás',
    },
  },

  en: {
    nav: {
      home: 'Home', about: 'About', projects: 'Projects', contact: 'Contact', allWork: 'All work',
      talk: "Let's talk", admin: 'Admin', openMenu: 'Open menu', closeMenu: 'Close menu', skip: 'Skip to content',
      main: 'Main', language: 'Language',
    },
    home: {
      available: 'Available for freelance',
      hi: "Hi, I'm",
      roles: ['Full-Stack Developer', 'React · Node.js', 'Data & Automation'],
      intro: 'I build web apps and tools that automate processes and make the most of data, with attention to every detail.',
      viewProjects: 'View projects',
      downloadCv: 'Download CV',
      projects: 'Projects',
      scroll: 'Scroll',
      scrollLabel: 'Scroll to the About section',
      photo: 'Juan Alvarado, web developer',
    },
    about: {
      label: 'about me', title: 'Who', highlight: 'I am',
      paragraphs: [
        "Hi, I'm **Juan Pablo**, a **full-stack developer** with experience building web apps, automating business processes and working with data.",
        "I currently work as a **database assistant at Autocolombiana**, where I built a web app to manage and analyze inventory using JavaScript, Python and AI.",
        "I'm studying a **Software Development technology degree** at UNAD and I love continuous learning: right now I'm studying **English and French**.",
        "I consider myself creative, proactive and great at solving problems. Away from code, I enjoy sports and series.",
      ],
      traits: [
        { titulo: 'Full-stack', texto: 'Specialized in frontend' },
        { titulo: 'Data & AI', texto: 'Process automation' },
        { titulo: 'Creative', texto: 'Problem solver' },
        { titulo: 'Always learning', texto: 'Now: English & French' },
      ],
      stack: 'Tech stack',
    },
    journey: {
      label: 'journey', title: 'My', highlight: 'journey',
      work: 'Experience', education: 'Education', languages: 'Languages', cv: 'Download résumé',
      jobs: [
        {
          puesto: 'Database Assistant', empresa: 'Autocolombiana', fecha: 'Dec 2025 – Present', actual: true,
          puntos: [
            'Built a web app to manage and analyze inventory (ERP and e-commerce) with JavaScript, Python and AI.',
            "Took part in reclassifying and standardizing product data in the company's ERP.",
            'Applied AI both to software development and to optimizing data analysis.',
          ],
        },
        {
          puesto: 'Database Assistant', empresa: 'Autogermana', fecha: 'Aug 2023 – Nov 2025',
          puntos: [
            'Managed and structured data for digital catalogs, ensuring quality and consistency.',
            'Organized product data (SKUs, references, categories and attributes) on corporate platforms.',
            'Built Excel and VBA tools to automate bulk creation and updates of information.',
          ],
        },
      ],
      studies: [
        {
          titulo: 'Software Development Technology Degree', lugar: 'Universidad Nacional Abierta y a Distancia (UNAD)', fecha: '2024 – 2027',
          texto: 'Requirements analysis, software development, databases and functional/quality testing.',
        },
      ],
      langs: [
        { nombre: 'Spanish', nivel: 'Native' },
        { nombre: 'English', nivel: 'Studying' },
        { nombre: 'French', nivel: 'Studying' },
      ],
    },
    projects: {
      label: 'selected work', title: 'Featured', highlight: 'Projects',
      description: "A selection of things I've built. Click any card to see the details.",
      seeAll: 'See all {n} projects',
    },
    portfolio: {
      label: 'portfolio', title: 'All', highlight: 'Projects',
      description: 'Search by name, technology or type of project.',
      search: 'Search projects…', searchLabel: 'Search projects',
      allTech: 'All technologies', techLabel: 'Filter by technology', sortLabel: 'Sort', typeLabel: 'Filter by type',
      all: 'All',
      showing: 'Showing **{a}** of {b} projects',
      clear: 'Clear filters',
      emptyTitle: 'No projects match your search',
      emptyText: 'Try another keyword or remove some filters.',
      sort: { destacados: 'Featured first', recientes: 'Most recent', antiguos: 'Oldest', nombre: 'Name (A–Z)' },
    },
    gallery: {
      error: "Couldn't load the projects right now.",
      retry: 'Try again',
      waking: 'Waking up the server — this can take a few seconds on the first visit.',
    },
    card: { details: 'See details of {nombre}', techs: 'Technologies', featured: 'Featured', photos: '{n} images', screenshot: 'Screenshot of {nombre}' },
    detail: {
      visit: 'Visit site', source: 'Source code', stack: 'Stack',
      challenge: 'The challenge', solution: 'The solution',
      prevImage: 'Previous image', nextImage: 'Next image', goToImage: 'Show image {n}',
    },
    modal: { prev: 'Previous project', next: 'Next project', close: 'Close' },
    contact: {
      label: 'contact', title: "Let's work", highlight: 'together',
      heading: 'Have a project in mind?',
      text: "Write me through the form, WhatsApp or social media — let's grab a coffee and build something together.",
      whatsapp: 'WhatsApp', cv: 'My CV',
      form: {
        name: 'Name', email: 'Email', message: 'Message',
        namePh: 'Your name', emailPh: 'you@email.com', messagePh: 'Tell me about your project…',
        send: 'Send message',
        success: "Message sent! I'll get back to you as soon as possible.",
        another: 'Send another message',
        errors: {
          nombre: 'Please enter your name',
          email: 'Please enter a valid email',
          mensaje: 'Your message should be at least 10 characters',
          limite: "You've sent several messages in a row. Please try again in a few minutes.",
          error: "Couldn't send it. Try again or message me on WhatsApp.",
        },
      },
    },
    footer: { tagline: 'Building fast, detailed web experiences that represent your brand.' },
    notFound: {
      label: '// page not found',
      title: 'Lost?', highlight: 'So is he',
      text: "Our red panda has been staring at the map for a while and can't find this page either. It may have moved, or the link might be mistyped.",
      home: 'Back to home', projects: 'See projects', back: 'Go back',
    },
  },
}
