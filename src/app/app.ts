import express, {Application, NextFunction, Request,response,Response} from 'express';
import session from 'express-session'

import path from 'path';
import passport from './utils/passport-config';

import { DBHandler } from './models/dbHandler';
import { BaseEventController } from './controllers/baseEventController';
import { authGuildAccess, RPCController } from './controllers/RPCController';
import { MQHandler } from './utils/MQHandler';
import { JWTAuthMiddleware } from './routers/AuthRouter';
import apiBaseRouter from './routers/api/apiBaseRouter';
import dashboardRouter from './routers/dashboard/dashboard-router';
import authRouter from './routers/AuthRouter';
import DashboardController from './controllers/HTTP Controllers/dashboardController';
import cookieParser from 'cookie-parser';



import connectSessionStore  from 'connect-session-sequelize'

const SequelizeStore = connectSessionStore(session.Store);

require('dotenv').config();

console.log("Starting HTTP SERVER");

const app : Application = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public',express.static(path.join(__dirname,'../../public')));
app.use(cookieParser());


let sessionStore = new SequelizeStore({
    db: DBHandler.getDBInstance(),
    checkExpirationInterval : 60*1000,       ////Changed this to like 1 min
    expiration : 60*60*1000
})

app.use(session({
    secret: process.env.JWT_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));

sessionStore.sync();


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


function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");     ////////////////CHANGE THIS TO /AUTH/DISCORD || HOMEPAGE
}


app.get('/', (req: Request, res: Response)=>{
   
    let user = req.session.user;

    
    res.render('site', {user:  user});
})
app.get('/pricing', (req: Request, res:Response)=>{
    let user = req.session.user;
    res.render('pricing', {user:user})
});
app.get('/dashboard', JWTAuthMiddleware, dashboard.serveDashboard);
app.get('/invite/:guildId',JWTAuthMiddleware, dashboard.inviteBotInstance);





app.listen(8080,'0.0.0.0', ()=>{
    console.log("Running at http://localhost:8080");
})