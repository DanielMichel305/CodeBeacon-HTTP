import { Router,Request,Response,NextFunction } from "express";
import DashboardApiController from "../../controllers/HTTP Controllers/dashboardController";

const dashboardApiRouter: Router = Router();


const dashboardController: DashboardApiController = new DashboardApiController()

dashboardApiRouter.get('/:guildId', dashboardController.getGuildSettings)


export default dashboardApiRouter;