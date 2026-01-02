import { useState, useEffect } from "react";



function App() {


  const[input,setInput]=useState("");
  const [tasks, setTasks] = useState([]); // it is list which is storing the input from the user

  async function fetchdata() {
    const res = await fetch("http://localhost:3000/tasks");
    const data = await res.json();
    console.log(data);
    setTasks(data.tasks);
  }

  useEffect(() => {
    fetchdata();
  }, []);

async function sendingdata(){
  if (!input.trim()) return;
  const response=await fetch("http://localhost:3000/tasks",{
    method:"post",
    headers: {"Content-Type": "application/json",},
    body:JSON.stringify({title:input})
    
  });
  
setInput("");
fetchdata();
}

async function updatefunction(id,newStatus){
  await fetch(`http://localhost:3000/tasks/${id}`,{
    method:"put",
    headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
  });
  fetchdata();
}

async function deleteTask(id){
  await fetch(`http://localhost:3000/tasks/${id}`,{
    method:"delete"
  });
  fetchdata();
}
  return (
    <div>
      <h1>TASK MANAGER</h1>
      <input type="text"
      value={input}
      onChange={(e)=>(
        setInput(e.target.value)
      )}      
      />
  <button onClick={sendingdata}>submit</button>
 <hr />  {/*use to make ---------- */}
 
      {tasks.map((task) => (
        <div key={task.id}>
         <strong> {task.title} </strong>
        <select 
        value={task.status}
        onChange={(e)=>updatefunction(task.id,e.target.value)}
        >
        <option value="todo">todo</option>
        <option value="in-progress">in-progress</option>
        <option value="done">done</option>
        </select>
        <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
