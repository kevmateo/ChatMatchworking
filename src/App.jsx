import './App.css'
import { useState, useRef, useEffect } from 'react'
import LogoLight from './assets/logo-light.png'
import LogoDark from './assets/logo-oscuro.png'
import { AiOutlineSend } from "react-icons/ai";
import { GoPlusCircle } from "react-icons/go";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import Mensajes from './componentes/mensajes'
import ChatUsuario from './componentes/chat-usuario'
import ChatOpenAI from './componentes/chat-openai';

function App() {

  const [chatVisible, setChatVisible] = useState(false);
  const [mensajes, setMensajes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [formCartaVisible, setFormCartaVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const mensajesContainerRef = useRef(null);


  const handlerEnviarMensajeServidor = (mensaje) => {
    const datos = {
      consulta: mensaje
    }
    console.log('Datos a enviar al servidor:', datos);

    const isCartaMotivacional = identificarSolicitudCartaMotivacional(mensaje);

    if (isCartaMotivacional) {
      setMensajes([...mensajes,
      { tipo: 'usuario', contenido: mensaje },
      { tipo: 'servidor', contenido: "Para ayudarte mejor, necesitaría que me proporciones algunos detalles importantes. ¿Podrías indicarme cuál es el cargo al que estás aplicando? Además, ¿podrías mencionar el nombre de la empresa a la que estás interesado en unirte? Por último, ¿podrías compartir cuántos años de experiencia tienes en ese cargo? Con esta información, podré generar una carta de motivación personalizada que destaque tus habilidades y tu interés en la posición." }
      ]);
      setFormCartaVisible(true);
    } else {
      fetch('http://26.162.12.140:3000/consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
        .then(response => response.json())
        .then(data => {
          const respuesta = data.respuesta;
          console.log('Respuesta del servidor:', respuesta);
          setMensajes([...mensajes, { tipo: 'usuario', contenido: mensaje }, { tipo: 'servidor', contenido: respuesta }]);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  const handlerEnviarDatosCarta = (mensaje) => {
    const datos = {
      cargo: document.getElementById('cargo').value,
      empresa: document.getElementById('empresa').value,
      experiencia: document.getElementById('experiencia').value
    }
    console.log('Datos a enviar al servidor:', datos);
    const mensajeUsuario = `Cargo: ${datos.cargo}, Empresa: ${datos.empresa}, Experiencia: ${datos.experiencia}`;
    fetch('http://26.162.12.140:3000/generarCarta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })
      .then(response => response.json())
      .then(data => {
        const respuesta = data.respuesta;
        console.log('Respuesta del servidor:', respuesta);
        setMensajes([...mensajes, { tipo: 'usuario', contenido: mensajeUsuario }, { tipo: 'servidor', contenido: respuesta }]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const enviarMensaje = (mensaje) => {
    setMensajes([...mensajes, { tipo: 'usuario', contenido: mensaje }]);
    handlerEnviarMensajeServidor(mensaje);
    setChatVisible(true);
    setInputValue('');
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      enviarMensaje(inputValue);
    }
  }

  const handleEnviarMensajeTarjeta = (mensaje) => {
    enviarMensaje(mensaje);
  }

  const identificarSolicitudCartaMotivacional = (mensaje) => {
    const patronesCartaMotivacional = [
      /\b(redactar|escribir|crear|componer|elaborar)\b.*(carta|texto)\b.*(motivacional|aliento|motivación|inspiración|superación|positivo)\b/i,
      /\b(necesito|requiero|me gustaría)\b.*(carta|texto)\b.*(motivacional|aliento|motivación|inspiración|superación|positivo)\b/i,
      /\b(podrías|serías tan amable)\b.*(redactar|escribir|crear|componer|elaborar)\b.*(carta|texto)\b.*(motivacional|aliento|motivación|inspiración|superación|positivo)\b/i,
      /\b(ayúdame|ayuda|asistencia)\b.*(creando|crear|haz|hacer)\b.*(carta|texto)\b.*(motivacional|aliento|motivación|inspiración|superación|positivo)\b/i,
      /\b(ayúdame|ayuda|asistencia)\b.*(crea[nr]|hacer|haz)\b.*(motivacional|motivaciona|aliento|inspiración|superación|positivo)\b/i,
      /\b(me\s?podrías)\b.*(ayudar|asistir)\b.*(crea[nr]|hacer|haz)\b.*(motivacional|motivaciona|aliento|inspiración|superación|positivo)\b/i
    ]

    for (const patron of patronesCartaMotivacional) {
      if (patron.test(mensaje)) {
        return true;
      }
    }
    return false;
  }

  const handleCerrarFormCarta = () => {
    setFormCartaVisible(false);
  }

  const scrollDown = () => {
    if (mensajesContainerRef.current) {
      mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
    }
  }

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  }

  useEffect(() => {
    scrollDown();
  }, [mensajes]);

  return (
    <div className='flex justify-center'>
      <button 
        className='w-auto h-11 flex items-center justify-center bg-principal-200 
        hover:bg-slate-600 text-white text-base rounded-xl my-3 px-5 fixed left-4 shadow-3xl
        dark:bg-principal-600 dark:text-black'
        onClick={() => {
          setChatVisible(false);
          setMensajes([]);
          setInputValue('');
          setFormCartaVisible(false);
        }}  
      > 
        <GoPlusCircle className='mr-3 text-2xl' />Nuevo</button>
      <div className='h-screen w-3/5 flex flex-col items-center' >
        {!chatVisible && (
          <section className='flex flex-col items-center w-full mt-44'>
            <img src={ darkMode ? LogoDark : LogoLight } alt='logo-light' className='w-36 h-28' />
            <p className='text-2xl w-96 text-center dark:text-white dark:font-thin'>Activa tu éxito con nuestro chat de cartas motivacionales.</p>
          </section>
        )}
        {chatVisible && (
          <section className='h-screen w-4/5 flex flex-col pb-16 pt-11'>
            <div className="overflow-y-auto no-scrollbar" ref={mensajesContainerRef}>
              {mensajes.map((mensaje, index) => {
                if (mensaje.tipo === 'usuario') {
                  return <ChatUsuario key={index} mensaje={mensaje.contenido} />
                } else if (mensaje.tipo === 'servidor') {
                  return <ChatOpenAI key={index} mensaje={mensaje.contenido} />
                }
                return null;
              })}
            </div>
            {formCartaVisible &&
              <div className={`flex flex-col p-6 rounded-2xl bg-slate-200 shadow-3xl translate-x-0 mx-10 
                dark:bg-principal-600 dark:placeholder-gray-700 dark:ring-0 dark:text-black`}
              >
                <input type="text" placeholder="Cargo" id='cargo' className='h-12 my-2 px-4 rounded-2xl shadow-3xl' />
                <input type="text" placeholder="Empresa" id='empresa' className='h-12 my-2 px-4 rounded-2xl shadow-3xl' />
                <input type="text" placeholder="Experiencia" id='experiencia' className='h-12 my-2 px-4 rounded-2xl shadow-3xl' />
                <div className='flex w-full justify-center  border-black'>
                  <button
                    className='h-12 mt-2 px-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white w-28 mx-3 shadow-3xl'
                    onClick={handleCerrarFormCarta}
                  >Cancelar</button>
                  <button
                    className='h-12 mt-2 px-4 rounded-2xl bg-principal-200 hover:bg-slate-600 text-white w-28 mx-3 shadow-3xl'
                    onClick={() => {
                      handlerEnviarDatosCarta();
                      handleCerrarFormCarta();
                    }}
                  >Listo</button>
                </div>
              </div>
            }
          </section>
        )}
        {!chatVisible && (
          <section className='grid grid-cols-2 gap-3 mt-40' >
            <Mensajes
              mensaje='¿Cómo se compone una carta de motivación?'
              onMensajeClick={handleEnviarMensajeTarjeta}
            />
            <Mensajes
              mensaje='¿Para qué sirve una carta de motivación?'
              onMensajeClick={handleEnviarMensajeTarjeta}
            />
            <Mensajes
              mensaje='Ayúdame creando una carta de motivación'
              onMensajeClick={handleEnviarMensajeTarjeta}
            />
            <Mensajes
              mensaje='¿Qué es una carta de motivación?'
              onMensajeClick={handleEnviarMensajeTarjeta}
            />
          </section>
        )}
        <footer className='w-full flex justify-center fixed bottom-0 my-4'>
          <input
            type='text'
            placeholder='Genera tu carta con Matchworking'
            className='w-full h-12 rounded-2xl px-4 mx-96 shadow-3xl bg-principal-200 text-white focus:ring-0
             dark:bg-principal-600 dark:text-black dark:placeholder-gray-700 dark:ring-0'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className='flex items-center absolute inset-y-1.5 right-97 w-auto px-4 bg-principal-300 text-zinc-800 rounded-xl hover:bg-principal-500'
            onClick={() => {
              enviarMensaje(inputValue);
            }}
          >
            Enviar <AiOutlineSend className='ml-2 w-6 h-7' />
          </button>
        </footer>
      </div>
      <button 
        className='w-11 h-11 flex items-center justify-center bg-principal-200 hover:bg-slate-600 rounded-full 
        text-white text-3xl shadow-3xl my-3 fixed right-4 dark:bg-principal-600 dark:text-black'
        onClick={handleDarkMode}
      >
        {darkMode ? <CiLight /> : <MdDarkMode />}
      </button>
    </div>
  )
}

export default App
