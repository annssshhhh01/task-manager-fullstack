import express from "express";
import pool from "./db.js";
const app=express();
app.use(express.json());
let port=3000;

//update
app.put("/tasks/:id",async (req,res)=>{
    try{
const idtoupdate=Number(req.params.id);
if(isNaN(idtoupdate) || idtoupdate<=0){  //isnan specificlly heck if it is a number or not 
      return res.status(400).json({ message: "invalid task id" });
}
const {status}=req.body;
const allowedStatus = ["todo", "in-progress", "done"];
if(!status || !allowedStatus.includes(status)){
     return res.status(400).json({ message: "invalid status value" });
}
const result=await pool.query("UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *",[status,idtoupdate]);

if(result.rowCount===0){
   return res.status(404).json({message:"not found"});
}
res.status(200).json({
    message:"status updated succesfully",
    task:result.rows[0]
});
    }catch(err){
        res.status(500).json({message:"server error buddy"});
    }
});


//delete request
app.delete("/tasks/:id", async (req,res)=>{
    try{
    const idtodelete=Number(req.params.id);
    if(isNaN(idtodelete) || idtodelete<=0){
       return res.status(400).json({message:"invalid id"});
    }
    const result=await pool.query("DELETE FROM tasks WHERE id=$1 RETURNING *",[idtodelete]);

    if(result.rowCount===0){
    return res.status(404).json({message:"task not found"});  //400 when invalid and 404 when it is valid but not present in db
    }
    res.status(200).json({
        message:"task deleted",
        task:result.rows[0]
    });
}catch(err){
    res.status(500).json({message:"server error"});
}
});

//use to fetch
app.get("/tasks",async (req,res)=>{
    try{
const result= await pool.query("SELECT * FROM tasks ");

res.status(200).json({
    count:result.rows.length,
    tasks:result.rows
    });
    }catch(err){
        res.status(500).json({message:"internal error"});
    }
})

//to send input to the server
app.post("/tasks",async (req,res)=>{
try{
const {title}=req.body;
if(!title || title.trim()===""){
    return res.status(400).json({message:"invalid or empty credentials"})
}
const result= await pool.query("INSERT INTO tasks (title) values($1) RETURNING *",[title]);

res.status(201).json({
    message:"title inserted succesfully",
    title:result.rows[0]
});
}catch(err){
    res.status(500).json({message:"server error or some internal error"});
}
});


app.get("/health",(req,res)=>{
    res.json({message:"everything is working fine"});
})
app.listen(port,()=>{
    console.log("server running on 3000 port");
});