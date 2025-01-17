const express = require('express');
require('dotenv').config();

const apiBaseRouter = require('./app/routers/apiBaseRouter');

const app = express();
app.use('/api',apiBaseRouter);

app.get('/', (req,res)=>{
    res.send('Hello world')
});


app.listen(8080, ()=>{
    console.log("Running at http://localhost:8080");
})