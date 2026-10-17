import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router"
import { faArrowRightToBracket, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AuthCard from "../components/AuthCard"
import Boton from "../components/Boton"
import Campo from "../components/Campo"
import Alert from "../components/Alert"
import clientAxios from "../config/clientAxios"
import useAuth from "../hooks/useAuth"
import useAlerta from "../hooks/useAlerta"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta()

  const {auth, setAuth} = useAuth();
  const navigate = useNavigate()

  // Con sesión activa no tiene sentido mostrar el login: se va directo al panel
  if (auth._id) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if([email,password].includes("")) return mostrarAlerta("Todos los campos son obligatorios")
    if(password.length < 8) return mostrarAlerta("La contraseña debe tener mínimo 8 caracteres")

    setEnviando(true)
    try {
      const {data} = await clientAxios.post('/usuarios/login', {email, password})
      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate("/admin");
    } catch (error) {
      // Sin response = el backend no respondió (dormido en Render, sin conexión, CORS)
      mostrarAlerta(error.response?.data?.msg ?? "No se pudo conectar con el servidor")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Alert isError={alerta.error} msg={alerta.msg} onClose={cerrarAlerta} />
      <AuthCard
        titulo="Welcome back"
        subtitulo="Inicia sesión para administrar tu portafolio"
        pie={<Link to="/" className="transition-colors hover:text-neon">← Volver al portafolio</Link>}
      >
        <form className='flex flex-col gap-5' onSubmit={handleSubmit} noValidate>
          <Campo
            label="Email" id="email" type="email" autoComplete="email" placeholder="tu@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <div className="relative">
            <Campo
              label="Contraseña" id="password" type={verPassword ? 'text' : 'password'}
              autoComplete="current-password" placeholder="Mínimo 8 caracteres" className="pr-12"
              value={password} onChange={e => setPassword(e.target.value)}
              extra={<Link to='/recover-password' className='text-xs text-muted transition-colors hover:text-neon'>¿La olvidaste?</Link>}
            />
            <button type="button" onClick={() => setVerPassword(v => !v)}
              aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-3 bottom-2.5 p-1 text-subtle transition-colors hover:text-fg">
              <FontAwesomeIcon icon={verPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <Boton type="submit" size="lg" loading={enviando} icon={faArrowRightToBracket} className="mt-2 w-full">
            Iniciar sesión
          </Boton>
        </form>
      </AuthCard>
    </>
  )
}

export default Login
