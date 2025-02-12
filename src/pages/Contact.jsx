import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Coffe from '/src/assets/coffe.png'
import HDV from '/src/assets/HojaDeVidaJPAV_2025.pdf'
import { Link } from "react-router-dom"
const Contact = () => {
  return (
    <section className='contact  bg-p_silverDark p-8' id="contact" >
    <h2 className='text-center  font-title text-5xl md:text-6xl text-p_white mb-16'>Contact
    <span className=' ml-4 w-72 font-title mb-2 font-bold text-5xl md:text-6xl inner-box--text '>
        Me
      </span>
    </h2>

    <div className='grid grid-cols-1 max-w-6xl mx-auto gap-8'>
      <div className=' p-8 flex  flex-col justify-center items-center'>
        <img className='w-44' src={Coffe} alt="cafe taza" />
        <p className=' text-p_white text-center m-4 text-lg font-text'>
        Contact me on my social media or via WhatsApp, let's do something together
        </p>
        <div className='flex gap-4 m-4 '>
        <Link to="https://www.instagram.com/pandaxcode/" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faInstagram} />
        </Link>
        <Link to="https://wa.me/573224081829" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faWhatsapp} />
        </Link>
        </div>
        <a href={ HDV} download="HojaDeVida.pdf" className={` uppercase text-p_white block w-40 text-center text-xl py-3 px-5 rounded-md inner-box`} >My cv</a>


      </div>

     {/*  <form className='border-1px flex flex-col p-4' action="">
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
      </form> */}
    </div>
    
    </section>
  )
}

export default Contact