import express, {Application} from 'express';
import apiBaseRouter from './app/routers/api/apiBaseRouter';
import dashboardRouter from './app/routers/dashboard/dashboard-router';

import { BaseEventController } from './app/controllers/baseEventController';
import { RPCController } from './app/controllers/RPCController';
import { MQHandler } from './app/utils/MQHandler';



require('dotenv').config();

console.log("Starting HTTP SERVER");

const app : Application = express();

const mqEventHandler = new BaseEventController();


(async()=>{         ///refactor this shitshow
    await mqEventHandler.init();
    mqEventHandler.startMessageQueueListener('SCD-DISCORD-COMM');
    const channel = mqEventHandler.getMQListener()?.getChannel();
    
    const rpcChannel = await MQHandler.createChannel('RPC');
    const rpc: RPCController = new RPCController(rpcChannel,'RPC-QUEUE',(req): any=>{
        console.log(`[RPC_LOG] NEW RPC CALL, ${req}`);
    })
    
})();



app.use(express.json());
app.use('/api',apiBaseRouter);
app.use('/d', dashboardRouter);



app.get('/', (req,res)=>{
    res.send('Hello world !')
});


app.listen(8080,'0.0.0.0', ()=>{
    console.log("Running at http://localhost:8080");
})