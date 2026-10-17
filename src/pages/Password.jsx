import { useState } from "react";
import { Link } from "react-router";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import AuthCard from "../components/AuthCard";
import Boton from "../components/Boton"
import Campo from "../components/Campo";
import Alert from "../components/Alert";
import clientAxios from "../config/clientAxios";
import useAlerta from "../hooks/useAlerta";

const Password = () => {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false)
  const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta()

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(!email) return mostrarAlerta("El email es obligatorio")

    setEnviando(true)
    try {
      const {data} = await clientAxios.post('/usuarios/recover-password', {email});
      mostrarAlerta(data.msg, false)
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? "No se pudo conectar con el servidor")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Alert isError={alerta.error} msg={alerta.msg} onClose={cerrarAlerta} />
      <AuthCard
        titulo="Recuperar acceso"
        subtitulo="Te enviaremos un enlace para crear una nueva contraseña"
        pie={<Link to="/login" className="transition-colors hover:text-neon">← Volver a iniciar sesión</Link>}
      >
        <form className='flex flex-col gap-5' onSubmit={handleSubmit} noValidate>
          <Campo label="Email" id="email" type="email" autoComplete="email" placeholder="tu@email.com"
            value={email} onChange={e => setEmail(e.target.value)} />
          <Boton type="submit" size="lg" loading={enviando} icon={faPaperPlane} className="w-full">Enviar enlace</Boton>
        </form>
      </AuthCard>
    </>
  )
}

export default Password
