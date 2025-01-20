import express, {Application} from 'express';
require('dotenv').config();

import apiBaseRouter from './app/routers/apiBaseRouter';

const app : Application = express();
app.use('/api',apiBaseRouter);

app.get('/', (req,res)=>{
    res.send('Hello world !')
});


app.listen(8080, ()=>{
    console.log("Running at http://localhost:8080");
})