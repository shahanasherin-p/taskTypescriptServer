
require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./routes/router')
require('./database/dbConnection')


const taskServer=express()


taskServer.use(cors())
taskServer.use(express.json())
taskServer.use(router)
taskServer.use('/uploads',express.static('./uploads'))

const PORT=3000 || process.env.PORT

taskServer.listen(PORT,()=>{
    console.log(`TASK-SERVER STARTED AT PORT ${PORT} AND WAITING FOR CLIENT REQUEST`)
})

taskServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style="color:red;">TASK-SERVER STARTED AT PORT AND WAITING FOR CLIENT REQUEST<h1/>`)
})