import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";

//TODO: REALIZAR UN STATE PARA MOSTRAR UN ENLACE AL LOGIN
//TODO: ENLACE AL LOGIN EN CASO DE NO SER VALIDO
const Confirm = () => {
  const params = useParams();
  const {id} = params;
  const [alerta, setAlerta]= useState({})
  useEffect(()=>{
    const confirmCuenta =async()=>{
      try {
        const url = `/usuarios/confirmar/${id}`
        const {data} = await clientAxios(url);

        setAlerta({msg :data.msg, //cuenta confirmada correctamente
        error : false
        })
        setTimeout(()=>{  //se elimina la alerta despues de 5s
          setAlerta({})
        }, 5000)
      } catch (error) {
        setAlerta({msg :"Token no valido", //Token no valido
        error : true
        })
        setTimeout(()=>{  //se elimina la alerta despues de 5s
          setAlerta({})
        }, 5000)
      }
    }
    return ()=>{confirmCuenta()};

  },[])
  return (
    <main>
      {alerta.msg && ( //se muestra de manera condicional la alerta
          <Alert 
            isError ={alerta.error}
            msg={alerta.msg}
          />
        )}
      <h1 className=' text-4xl text-p_white font-title text-center p-44'>Tu cuenta ha sido confirmada</h1>
    </main>
  )
}

export default Confirm