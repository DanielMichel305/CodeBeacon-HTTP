import { Router,Request,Response,NextFunction } from "express";
import {MentionRoleController} from '../../../controllers/discord/rolesController'
import { JWTAuthMiddleware } from "../../AuthRouter";



export const mentionRoleRouter : Router = Router()
    .get('/',JWTAuthMiddleware ,MentionRoleController.getAllMentionRoles)
    .post('/',JWTAuthMiddleware, MentionRoleController.createNewRole)     ////ADDD JWT MENTION ROLES, IT'S OUT DUE TO TESTING!!
    .delete('/:id', JWTAuthMiddleware, MentionRoleController.removeMentionRole)

