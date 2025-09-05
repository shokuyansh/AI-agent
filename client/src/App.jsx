import { useState } from 'react'
import axios from 'axios'

import {toast , ToastContainer} from 'react-toastify'
import './App.css'

import ResultsTable from './ResultsTable';
import ExpenseChart from './ExpenseChart';

axios.defaults.withCredentials = true;
function App() {
  const [userMessage, setUserMessage] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total,setTotal] = useState(null);
  

  const handleInput = async() => {
    if(!userMessage.trim()){
      toast.error("Please enter a message");
      return;
    }
    setIsLoading(true);
    setResults([]);
    setTotal(null);
    try{
        console.log(userMessage);
        const result = await axios.post(`http://localhost:3000/agent`,{userMessage});
        console.log(result.data);
        const data=result.data;
        if (data.length > 0 && data[0].hasOwnProperty('total_amount')) {
          setTotal(data[0].total_amount);
        const cleanedData = data.map(({ total_amount, ...rest }) => rest);
        setResults(cleanedData);
      } else {
        setResults(data);
      }
        if(result.status===200&&result.data.length===0){
          toast.success("Success");
        }
    }catch(err){
        console.error('Error sending message:', err);
        toast.error(err.response.data.error);
    }finally{
      setIsLoading(false);
    }
  }
  const renderResults = ()=>{
      if(isLoading){
        return <p>Thinking...</p>
      }
      if(results.length===0){
        return null;
      }
      const firstResult = results[0];
      if(firstResult.hasOwnProperty('item')&&firstResult.hasOwnProperty('amount')){
        return <ExpenseChart data={results}/>;
      }else{
      return <ResultsTable data={results}/>;
      }
    };
  return (
    <div className='container'>
      <h1>AI assistant</h1>
      <div className='input-group'>
      <input 
      type="text" 
      onChange={(e)=>setUserMessage(e.target.value)}
      onKeyDown={(e)=> e.key==='Enter'&&handleInput()}
      placeholder='e.g show my groceries list'/>
      <button onClick={handleInput} disabled={isLoading}>
        Send
      </button>
      </div>
      {total && (
        <div className="total-display">
          <h2>Total Spent: ₹{total}</h2>
        </div>
      )}
      <div className='results-container'>
        {renderResults()}
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
    </div> 
  )
}

export default App
