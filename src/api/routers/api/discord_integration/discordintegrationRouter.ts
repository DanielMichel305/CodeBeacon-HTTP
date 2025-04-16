import { Router,Request,Response,NextFunction } from "express";
import { JWTAuthMiddleware } from "../../AuthRouter";
import { DiscordIntegrationController } from "../../../controllers/discord/integrationController";



export const discordIntegrationRouter : Router = Router()
    .get('/',JWTAuthMiddleware, DiscordIntegrationController.getUserDiscordIntegrations)
    .post('/', JWTAuthMiddleware, DiscordIntegrationController.createDiscordIntegration)             ////Add Subscription checkker Middleware
    .get('/webhook/:wid', JWTAuthMiddleware, DiscordIntegrationController.getWebhookDiscorIntegrations)
    
    