import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Boton from "../components/Boton"
import Coffe from '/src/assets/coffe.png'
const Contact = () => {
  return (
    <section className='contact  bg-p_silverDark p-8' >
    <h2 className='text-center  font-title text-6xl text-p_white mb-16'>Contact
    <span className=' ml-4 w-72 font-title mb-2 font-bold text-6xl inner-box--text '>
        Me
      </span>
    </h2>

    <div className='grid grid-cols-2 max-w-6xl mx-auto gap-8'>
      <div className=' p-8 flex  flex-col justify-center items-center'>
        <img className='w-44' src={Coffe} alt="cafe taza" />
        <p className=' text-p_white text-center m-4 text-lg font-text'>Contactame en mis redes sociales o por whatsapp, hagamos algo juntos!</p>
        <div className='flex gap-4 m-4 '>
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faWhatsapp} />
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faInstagram} />
        </div>
        <Boton isImportant
        msg="My cv"

        />
      </div>

      <form className='border-1px flex flex-col p-4' action="">
          <label className=' text-p_white font-text my-2 ' >Nombre</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text ' type="text" />

          <label className=' text-p_white font-text my-2 ' htmlFor="">Correo</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text ' type="email" name="" id="" />

          <label className=' text-p_white font-text my-2 ' htmlFor="">Descripcion</label>
          <textarea 
          className='bg-transparent border-1px p-2 text-p_white font-text '
          name="" id="" cols="20" rows="10"></textarea>
          <Boton isBtn
            msg="Send EMail"
          />
      </form>
    </div>
    
    </section>
  )
}

export default Contact