import LogoLight from '../assets/logo-light.png'

function ChatOpenAI({ mensaje }) {
  return (
    <div className='w-full min-h-12 h-auto bg-principal-200 flex items-center p-3 my-3 rounded-xl shadow-3xl 
    text-white font-extralight dark:bg-principal-600 dark:text-black'>
      <img src={LogoLight} className='min-w-9 min-h-9 max-w-9 max-h-9 bg-principal-600 flex items-center justify-center 
        rounded-full shadow-3xl font-extrabold mr-3 dark:bg-white' />
      <p>{mensaje}</p>
    </div>
  )
}

export default ChatOpenAI;