import Boton from "../components/Boton"
import Alert from "../components/Alert";
import axios from "axios";
import { useState } from "react";

const Password = () => {
  const [alerta, setAlerta] = useState({});
  const [email, setEmail] = useState("");
  const handleSubmit = async (e)=>{ //Funcion para enviar correo para reestablecer el password
    e.preventDefault();

    if([email].includes("")){
      setAlerta({msg : "El email es obligatorio",
    error : true
    })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)

      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/recover-password`
      const {data} = await axios.post(url, {email});

      setAlerta({msg :data.msg, //Correo enviando correctamente
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


  return (
    <main className='max-w-6xl mx-auto py-20'>
      {alerta.msg && ( //se muestra de manera condicional la alerta
          <Alert 
            isError ={alerta.error}
            msg={alerta.msg}
          />
        )}
      
      <form className='border-1px flex flex-col p-8 max-w-md  mx-auto' onSubmit={handleSubmit}>
        
        <legend className='font-title text-4xl mb-8 text-p_white'>Recuperar Password</legend>

        <label className=' text-p_white font-text my-2 '
        htmlFor="email"
        >Email</label>
        <input className='bg-transparent border-1px p-2 text-p_white font-text '
        type="email"
        name="email" id="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
        <Boton isBtn
          msg="Recuperar Password"
          clase='w-full'
        />
       </form>
    </main>
    
  )
}

export default Password