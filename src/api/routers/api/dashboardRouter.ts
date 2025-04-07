import { Router,Request,Response,NextFunction } from "express";
import DashboardApiController from "../../controllers/dashboardController";

const dashboardApiRouter: Router = Router();


const dashboardController: DashboardApiController = new DashboardApiController()

dashboardApiRouter.get('/ping', (req: Request,res:Response)=>{res.send('PONG!')})
dashboardApiRouter.get('/:guildId', dashboardController.getGuildSettings);

dashboardApiRouter.post('/invite', dashboardController.inviteBot);
           

export default dashboardApiRouter;