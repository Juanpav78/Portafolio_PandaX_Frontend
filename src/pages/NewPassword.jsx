import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router"
import AuthCard from "../components/AuthCard";
import Boton from "../components/Boton"
import Campo from "../components/Campo";
import Alert from "../components/Alert";
import clientAxios from "../config/clientAxios";
import useAlerta from "../hooks/useAlerta";

// El enlace del email trae un token de un solo uso. Primero se valida (GET) y sólo si es
// válido se muestra el formulario; así el usuario no rellena nada para luego descubrir que
// el enlace caducó.
const NewPassword = () => {
    const {token}  = useParams();
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    // 'comprobando' | 'valido' | 'invalido' | 'cambiado'
    const [estado, setEstado] = useState('comprobando')
    const [enviando, setEnviando] = useState(false)
    const { alerta, mostrarAlerta, cerrarAlerta } = useAlerta()
    const comprobado = useRef(false) // evita doble petición en StrictMode

    useEffect(()=>{
        if(comprobado.current) return
        comprobado.current = true
        clientAxios(`/usuarios/recover-password/${token}`)
          .then(() => setEstado('valido'))
          .catch(() => setEstado('invalido'))
    },[token])

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(password.length < 8) return mostrarAlerta("La contraseña debe tener mínimo 8 caracteres")
        if(password !== repeatPassword) return mostrarAlerta("Las contraseñas no coinciden")

        setEnviando(true)
        try {
            const {data} = await clientAxios.post(`/usuarios/recover-password/${token}`, {password});
            mostrarAlerta(data.msg, false)
            setEstado('cambiado')
        } catch (error) {
            mostrarAlerta(error.response?.data?.msg ?? "No se pudo conectar con el servidor")
        } finally {
            setEnviando(false)
        }
    }

    const textos = {
      comprobando: ['Verificando enlace…', 'Un momento, estamos validando tu enlace'],
      valido: ['Nueva contraseña', 'Elige una contraseña de al menos 8 caracteres'],
      invalido: ['Enlace no válido', 'El enlace caducó o ya fue utilizado. Solicita uno nuevo.'],
      cambiado: ['¡Listo!', 'Tu contraseña se cambió correctamente'],
    }
    const [titulo, subtitulo] = textos[estado]

  return (
    <>
      <Alert isError={alerta.error} msg={alerta.msg} onClose={cerrarAlerta} />
      <AuthCard titulo={titulo} subtitulo={subtitulo}>
        {estado === 'comprobando' && <div className="skeleton mx-auto h-12 w-full rounded-xl" />}

        {estado === 'valido' && (
          <form className='flex flex-col gap-5' onSubmit={handleSubmit} noValidate>
            <Campo label="Contraseña" id="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres"
              value={password} onChange={e => setPassword(e.target.value)} />
            <Campo label="Repite tu contraseña" id="repeat-password" type="password" autoComplete="new-password"
              value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)}
              error={repeatPassword && password !== repeatPassword ? 'Las contraseñas no coinciden' : undefined} />
            <Boton type="submit" size="lg" loading={enviando} className="w-full">Cambiar contraseña</Boton>
          </form>
        )}

        {estado === 'invalido' && <Boton to="/recover-password" variant="ghost" className="w-full">Solicitar nuevo enlace</Boton>}
        {estado === 'cambiado' && <Boton to="/login" className="w-full">Iniciar sesión</Boton>}

        {estado !== 'cambiado' && (
          <Link to="/login" className="mt-6 block text-center text-sm text-muted transition-colors hover:text-neon">← Volver a iniciar sesión</Link>
        )}
      </AuthCard>
    </>
  )
}

export default NewPassword
