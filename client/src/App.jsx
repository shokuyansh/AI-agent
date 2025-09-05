import { useState } from 'react'
import axios from 'axios'
import {toast , ToastContainer} from 'react-toastify'
import './App.css'
import ChatMessage from './ChatMessage'
import { useRef } from 'react'
import { useEffect } from 'react'

axios.defaults.withCredentials = true;
const backendURL = import.meta.env.VITE_BACKEND_URL;
function App() {

  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history,setHistory] = useState([{ sender: 'assistant', content: 'Hello! How can I help you today?', type: 'text' }]);  
  const chatHistoryRef = useRef(null);

useEffect(()=>{
  if(chatHistoryRef.current){
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }
},[history]);

  const handleInput = async() => {
    if(!userMessage.trim()){
      toast.error("Please enter a message");
      return;
    }
    const newUserMessage = { sender: 'user', content: userMessage, type: 'text' };
    setHistory(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    setHistory(prev => [...prev, { sender: 'assistant', type: 'loading' }]);
    try{
        console.log(userMessage);
        const result = await axios.post(`${backendURL}/agent`,{userMessage});
        console.log(result.data);
        const data = result.data;
        let newAssistantMessage = {};

       if (data.length === 0) {
            const queryKeywords = ['show', 'list', 'get', 'view', 'display', 'find'];
            const isQuery = queryKeywords.some(keyword => currentMessage.toLowerCase().startsWith(keyword));

            if (isQuery) {
                newAssistantMessage = { sender: 'assistant', content: "I couldn't find anything for that.", type: 'text' };
            } else {
                newAssistantMessage = { sender: 'assistant', content: 'Done!', type: 'text' };
            }
      } else if (data[0].hasOwnProperty('item') && data[0].hasOwnProperty('amount')) {
        newAssistantMessage = { sender: 'assistant', content: data, type: 'chart' };
      } else {
        newAssistantMessage = { sender: 'assistant', content: data, type: 'table' };
      }
      setIsLoading(true);
      setHistory(prev => [...prev.slice(0, -1), newAssistantMessage]);
    }catch(err){
        console.error('Error sending message:', err);
        toast.error(err.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div className='app-container'>
      <header>
        <h1>AI Assistant</h1>
      </header>
      <main className='chat-history' ref={chatHistoryRef}>
        {history.map((msg,index)=>(
          <ChatMessage key={index} message={msg}/>
        ))}
      </main>
      <footer className='input-area'>
      <input 
      type="text"
      value={userMessage} 
      onChange={(e)=>setUserMessage(e.target.value)}
      onKeyDown={(e)=> e.key==='Enter'&&handleInput()}
      placeholder='e.g show my groceries list'/>
      <button onClick={handleInput} disabled={isLoading}>
        Send
      </button>
      </footer>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
    </div> 
  )
}

export default App
