import express, {Application} from 'express';
import apiBaseRouter from './app/routers/api/apiBaseRouter';
import dashboardRouter from './app/routers/dashboard/dashboard-router';
import authRouter from './app/routers/auth/auth-router';
import { BaseEventController } from './app/controllers/baseEventController';
import { MQHandler } from './app/utils/MQHandler';


require('dotenv').config();

console.log("Starting HTTP SERVER");

const app : Application = express();

const mqEventHandler = new BaseEventController();

(async()=>{
    await mqEventHandler.init();
    mqEventHandler.startMessageQueueListener('SCD-DISCORD-COMM');    
})();



app.use(express.json());
app.use('/api',apiBaseRouter);
app.use('/d', dashboardRouter);
app.use('/auth', authRouter);


app.get('/', (req,res)=>{
    res.send('Hello world !')
});


app.listen(8080,'0.0.0.0', ()=>{
    console.log("Running at http://localhost:8080");
})