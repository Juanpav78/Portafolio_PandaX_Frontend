import { Link } from "react-router-dom"

const Boton = ({isImportant = false, isNormal = false, 
              msg = "", isLink = false,  isBtn = false,
              clase = "", where ="/"
            }) => {
  return (
    <>
      {isNormal && (
        <a href={where} className={` uppercase text-p_white block w-40 text-center border-1px text-xl py-3 px-5 rounded-md`} >
        {msg}
        </a>
      )}
      {isImportant && (
        <a href={where} className={` uppercase text-p_white block w-40 text-center text-xl py-3 px-5 rounded-md inner-box`} >
        {msg}
        </a>
      )}
      {isLink && (
        <Link 
        to={where}
        className={` uppercase text-p_white block w-40 border-1px text-xl py-3 px-5 text-center rounded-md ${clase}`}>
        {msg}
        </Link>

      )}
      {isBtn && (
        <button className='uppercase my-4 mx-auto text-p_white block w-40 text-center text-xl py-3 px-5 rounded-md inner-box'>
          {msg}
        </button>
      )

      }
    
    </>

  )
}

export default Boton