import { useParams } from "react-router-dom"
import Boton from "../components/Boton"
import Alert from "../components/Alert";
import clientAxios from "../config/clientAxios";
import { useEffect, useState } from "react";

//TODO: REALIZAR UN STATE PARA MOSTRAR UN ENLACE AL LOGIN
//TODO: ENLACE AL LOGIN EN CASO DE NO SER VALIDO
const NewPassword = () => {
    const {token}  = useParams();
    const [alerta, setAlerta] = useState({});
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isToken, setIsToken] = useState(false)

    const handleSubmit = async (e)=>{ //Funcion para reestablecer el password
        e.preventDefault();

        if(password.length < 8){
            setAlerta({msg : "Las contraseña debe ser de minimo 8 caracteres"})
            setTimeout(()=>{  //se elimina la alerta despues de 5s
              setAlerta({})
            }, 5000)
            return;
        }
        
      
        if(password !== repeatPassword){
            setAlerta({msg : "Las contraseñas no coinciden",
            error : true
          })
            setTimeout(()=>{  //se elimina la alerta despues de 5s
              setAlerta({})
            }, 5000)
            return;
        }

        try {
            const url = `/usuarios/recover-password/${token}`
            const {data} = await clientAxios.post(url, {password});

            setAlerta({msg :data.msg, //password cambiado de forma exitosa
            error : false
            })
            setTimeout(()=>{  //se elimina la alerta despues de 5s
                setAlerta({})
            }, 5000)
        } catch (error) {
            setAlerta({msg : error.response.data.msg, // Mensaje de error
            error : true
            })
            setTimeout(()=>{  //se elimina la alerta despues de 5s
                setAlerta({})
            }, 5000)
        }
    }

    useEffect(()=>{
        const comprobarToken = async ()=>{
          try {
            const {data} = await clientAxios(`/usuarios/recover-password/${token}`)
            setAlerta({msg :data.msg, //Token verificado
            error : false
            })
            setTimeout(()=>{  //se elimina la alerta despues de 5s
              setAlerta({})
            }, 5000)
            setIsToken(true)
            
          
          } catch (error) {
            setAlerta({msg : error.response.data.msg, // Mensaje de error
            error : true
            })
            setTimeout(()=>{  //se elimina la alerta despues de 5s
              setAlerta({})
            }, 5000)
    
          }

          
        }
    
        return ()=>{comprobarToken()}
      },[])
  return (
    <main className='max-w-6xl mx-auto py-20'>
        {alerta.msg && ( //se muestra de manera condicional la alerta
          <Alert 
            isError ={alerta.error}
            msg={alerta.msg}
          />
        )}
    {isToken ? (
        <form className='border-1px flex flex-col p-8 max-w-md  mx-auto' onSubmit={handleSubmit}>
        
        <legend className='font-title text-4xl mb-8 text-p_white'>Nuevo Password</legend>

        <label className=' text-p_white font-text my-2 ' htmlFor="password">Contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="password" id="password" placeholder="min. 8 caracteres" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 ' htmlFor="repeat-password">Repite tu contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="repeat-password" id="repeat-password" placeholder="min. 8 caracteres"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          />
        <Boton isBtn
          msg="Cambiar Password"
          clase='w-full'
        />
       </form>
    ):(
        <h1 className=' text-4xl text-p_white font-title text-center p-44'>Token no valido :/</h1>
    )}
    

    </main>
  )
}

export default NewPassword