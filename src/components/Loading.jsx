import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import logo from "../assets/PandaX_White.svg"
const Loading = () => {
  return (
    <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    
    className=' fixed w-full h-screen bg-p_cake flex flex-col'>
        <motion.div
         animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0]
          }}
          viewport={{ once: true }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: .5
          }}
        className=" block w-12 h-12 m-auto" >
               <img src={logo} alt="" />
        </motion.div>
          <p className="font-title font-bold text-4xl text-p_white">Cargando...</p>
    </motion.div>
  )
}

export default Loading