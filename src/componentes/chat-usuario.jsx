
function ChatUsuario({ mensaje }) {
  return (
    <div className='w-full min-h-12 h-auto bg-principal-400 flex items-center p-3 my-3 rounded-xl shadow-3xl'>
      <span className='min-w-9 min-h-9 bg-principal-600 flex items-center justify-center rounded-full shadow-3xl font-extrabold text-2xl mr-3'>U</span>
      <p>{mensaje}</p>
    </div>
  );
}

export default ChatUsuario;