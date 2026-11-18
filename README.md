# 🐼 Portafolio — Juan Pablo Alvarado

> Mi portafolio personal y el panel de administración con el que gestiono proyectos, clientes, cotizaciones y pagos.
>
> 🔗 **[juanpalvaradov.com](https://juanpalvaradov.com)**

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)

## ✨ Funcionalidades

### Sitio público
- Presentación, trayectoria, tecnologías y formulario de contacto
- Proyectos destacados cargados desde la API, con modal de detalle y galería de imágenes
- Sitio en español e inglés: recuerda el idioma elegido y, en la primera visita, usa el del navegador
- Descarga de la hoja de vida
- Animaciones con Framer Motion

### Panel de administración (rutas protegidas)
- Inicio de sesión, recuperación y cambio de contraseña
- CRUD de proyectos con galería, tecnologías y proyectos destacados
- Servicios, testimonios y retos que también se publican en [pandaxcode.com](https://pandaxcode.com)
- Bandeja de mensajes del formulario de contacto
- Clientes, cotizaciones y pagos
- Planes y calendario
- El panel se carga bajo demanda (`React.lazy`) para no aumentar el peso del sitio público

## 🛠️ Stack

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS 4, Framer Motion, Font Awesome |
| Datos | Axios contra una API REST |
| Backend | [Portafolio_PandaX_Backend](https://github.com/Juanpav78/Portafolio_PandaX_Backend) (Express + MongoDB) |
| Calidad | ESLint y optimización de imágenes con sharp |
| Despliegue | Netlify |

## 🚀 Cómo correrlo

```bash
git clone https://github.com/Juanpav78/Portafolio_PandaX_Frontend.git
cd Portafolio_PandaX_Frontend
npm install
npm run dev
```

La URL de la API se define en `VITE_BACKEND_URL` dentro de `.env.development` y `.env.production`.

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | Revisa el código con ESLint |
| `npm run optimize:images` | Comprime las imágenes de los proyectos |

## 📁 Estructura

```
src/
├── components/        # UI del sitio y del panel (components/admin)
├── pages/             # Páginas públicas y del panel (pages/admin)
├── context/           # Auth, idioma, proyectos y planes
├── config/            # Cliente de Axios
└── helpers/           # Fechas, dinero, cotizaciones
```

---

Hecho por **Juan Pablo Alvarado** · [Portafolio](https://juanpalvaradov.com) · [LinkedIn](https://www.linkedin.com/in/juanpavpandax/) · [GitHub](https://github.com/Juanpav78)
