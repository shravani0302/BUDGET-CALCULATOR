import React,{useState,useEffect} from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import uuid from "uuid/dist/v4";

// const initialExpenses=[
//   {id:uuid(),charge:"rent",amount:1000},
//   {id:uuid(),charge:"shop",amount:1200},
//   {id:uuid(),charge:"hairband",amount:6700}
// ]
// console.log(initialExpenses);

const initialExpenses=localStorage.getItem("expenses")
  ?JSON.parse(localStorage.getItem("expenses")) : [];

function App() {

  //all expenses for calcting total amount
  const [expenses,setExpenses]=useState(initialExpenses);
  const [charge,setCharge]=useState("");  //single chRarge
  const [amount,setAmount]=useState("");  //single amount
  const [alert,setAlert]=useState({show:false})
  const [edit,setEdit]=useState(false);
  const [id,setId]=useState(0); 

  useEffect(() => {
    localStorage.setItem('expenses',JSON.stringify(expenses))
  },[expenses]);
  
  //Below are written for the functioning of charge amount and submit
  const handleCharge = e => {
    setCharge(e.target.value);
  };

  const handleAmount=e=>{
    setAmount(e.target.value);
  };

  const handleAlert=({type,text})=>{
    setAlert({show:true,type,text})
    setTimeout(()=>{
      setAlert({show:false})
    },3000)
  }

  const handleSubmit=e=>{
    e.preventDefault();
    if(charge!=="" && amount>0){
      if(edit){
        let tempExpenses=expenses.map(item=>{
          return item.id===id ? {...item,charge,amount} : item ;
        })
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({type:"success",text:"Item Edited"})
      }else{
        const singleExpense={id:uuid(),charge,amount};
        setExpenses([...expenses,singleExpense]);  //charge and amount fields are empty after submitting it
      }

      setCharge("");  //charge becomes empty
      setAmount(""); //amount becomes empty
      handleAlert({type:"success",text:"Item Added"})
    }else{
      handleAlert({type:"danger",text:'charge cannot be empty value.'})
    }
  };

  //deleting and editing items

  const clearItems=()=>{
    setExpenses([]);
    handleAlert({type:"danger",text:"All items are deleted"})
  }

  const handleDelete=id=>{
    let tempExpenses=expenses.filter(item=>item.id !==id);
    setExpenses(tempExpenses);
    handleAlert({type:"danger",text:"Item Deleted"})
  }

  const handleEdit=(id)=>{
    let expense=expenses.find(item=>item.id === id)
    let {charge,amount}=expense;
    setCharge(charge);
    setAmount(amount);
    setId(id);
    setEdit(true);
  };
  
  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text}/>}
    <Alert/>
      <h1>Bugdet Calculator</h1>
    <main className="App">
      {/*passing the functionalities to components */}
      <ExpenseForm charge={charge} amount={amount} handleCharge={handleCharge} handleAmount={handleAmount} handleSubmit={handleSubmit} edit={edit}/>
      <ExpenseList expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems}/>
    </main>
      <h1>
      total spending :{" "}
        <span className="total">
          ${expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));  //using parseint not to take the value as number instead of string
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;

