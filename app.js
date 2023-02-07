const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const fs = require('fs');
const secretkey= "secretkey"
const cron = require('node-cron');  //A simple cron-like task scheduler for Node.js
const moment = require('moment'); //for formating 


app.get("/", (req,resp)=>{
    resp.json({
        message: "A Simple API"
    })
})


//genrating token
app.post("/user", (req,resp)=>{
    const user={
        username: "yash",
        passward: 'XYG123'
    }
    jwt.sign({user},secretkey, {expiresIn: '3000s'},(err,token)=>{
        resp.json({
            token
        })
    })
});

//vailedation
app.get('/validate-user',verifyToken,(req,resp)=>{
    jwt.verify(req.token,secretkey,(err,authData)=> {
        if(err){
            resp.send({result: "invaild token"})
        }else{
            resp.json({
                message:"profile accessed",
                authData
            })
        }
    })
});

//verifying
function verifyToken(req,resp,next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token= bearer[1];
        req.token=token;
        next();
    }else{
        resp.send({
            result: 'Token is not valid'
        })
    }
    next();

}

//Cron jobs

const job = new cron.schedule("* * * * * ", ()=> {
    let data =`running a task in every 10sec ${new Date()}
        :server is working\n`;
        console.log(data);

    fs.appendFile('log.txt',data,function (err) {
        if (err) {
            console.log(err);
        }
        else {
            // Get the file contents after the append operation
            console.log("\nFile Contents of file after append:");
          }
        
    })
});
job.start();


//server
app.listen(5000,()=>{
    console.log('app is running in 5000 port');
})

