
const Alert = ({isError = false, msg=""}) => {
  return (
    <div className={`fixed w-1/3 p-5  uppercase right-0 ${isError ? "bg-p_red" : "bg-p_blue"}`}>
        {isError}
        <p className=' text-center text-p_white font-bold font-text text-lg'>{msg}</p>
    </div>
  )
}

export default Alert