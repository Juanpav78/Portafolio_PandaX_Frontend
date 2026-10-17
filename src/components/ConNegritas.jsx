// Pinta en negrita lo que va entre **dobles asteriscos** en los textos traducidos. Permite
// destacar palabras dentro de una frase sin partirla en varias claves (lo que rompería el
// orden natural de las palabras al traducir).
const ConNegritas = ({ texto, clase = 'text-fg' }) =>
  texto.split('**').map((parte, i) =>
    i % 2 ? <strong key={i} className={clase}>{parte}</strong> : parte)

export default ConNegritas
