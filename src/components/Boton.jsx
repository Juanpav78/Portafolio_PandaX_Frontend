
const Boton = ({isImportant = false, msg = ""}) => {
  return (
    <a href="" className={`text-p_white text-xl p-3 rounded-md ${isImportant && 'bg-gradient-to-r from-p_orangeDark to-p_orange'}`} >
      {msg}
    </a>
  )
}

export default Boton