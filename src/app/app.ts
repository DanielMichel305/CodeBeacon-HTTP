import express, {Application, Request,Response} from 'express';
import session from 'express-session'

import path from 'path';
import passport from './utils/passport-config';


import { BaseEventController } from './controllers/baseEventController';
import { authGuildAccess, RPCController } from './controllers/RPCController';
import { MQHandler } from './utils/MQHandler';
import apiBaseRouter from './routers/api/apiBaseRouter';
import dashboardRouter from './routers/dashboard/dashboard-router';
import authRouter from './routers/AuthRouter';
import DashboardController from './controllers/HTTP Controllers/dashboardController';



require('dotenv').config();

console.log("Starting HTTP SERVER");

const app : Application = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));


app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


const mqEventHandler = new BaseEventController();


(async()=>{         ///refactor this shitshow
    await mqEventHandler.init();
    mqEventHandler.startMessageQueueListener('SCD-DISCORD-COMM');
    const channel = mqEventHandler.getMQListener()?.getChannel();
    
    const rpcChannel = await MQHandler.createChannel('RPC');
    const rpc: RPCController = new RPCController(rpcChannel,'rpc.dashboard.auth.guild_access', async (msg)=>authGuildAccess(msg))               ///Why Does this need to be async
    
})();

const dashboard: DashboardController = new DashboardController()



app.use(express.json());
app.use('/api',apiBaseRouter);
app.use('/d', dashboardRouter);
app.use('/auth', authRouter)


app.get('/', (req: Request, res: Response)=>{
    
    let userArray: any[];
    let user = null;
    if(req.user){
        userArray = req.user as any[];
        user = userArray[0];
    }
    
    res.render('site', {user:  user});
})

app.get('/dashboard', dashboard.serveDashboard);
app.get('/invite/:guildId', passport.authenticate('discord', {failureRedirect : '/', failureMessage : 'Sign in using discord first'}),dashboard.inviteBotInstance);





app.listen(8080,'0.0.0.0', ()=>{
    console.log("Running at http://localhost:8080");
})