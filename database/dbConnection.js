const mongoose=require('mongoose')

const connectionString=process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("Mongodb atlas connected successfully with TASK-SERVER ")
}).catch(err=>{
    console.log("mongodb connection failed");
    console.log(err)
})