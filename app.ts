import express, {Application} from 'express';
import apiBaseRouter from './app/routers/apiBaseRouter';

require('dotenv').config();

const app : Application = express();

app.use(express.json());
app.use('/api',apiBaseRouter);




app.get('/', (req,res)=>{
    res.send('Hello world !')
});


app.listen(8080, ()=>{
    console.log("Running at http://localhost:8080");
})