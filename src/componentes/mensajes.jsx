
function Mensajes({ mensaje, onMensajeClick }) {
  return (
    <div 
      className="flex items-center w-80 h-16 px-3 rounded-xl bg-slate-200 shadow-3xl cursor-pointer dark:bg-principal-600"
      onClick={() => onMensajeClick(mensaje)}  
    >
      <p>{mensaje}</p>
    </div>
  );
}

export default Mensajes;