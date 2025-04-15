import { DiscordUser } from '../../../utils/passport-config';
import { Request,Response } from 'express';
import { Webhook,DiscordIntegration,MentionRole, User} from '../../models/associations';


export class MentionRoleController {

    public static async getAllMentionRoles(req: Request, res: Response){

        const loggedInUser = req.user as DiscordUser;
    
        const altMethod = await MentionRole.findAll({
            attributes:['id','integration_id','role_id', 'role_name','createdAt'],
            include:[{
                model: DiscordIntegration,
                attributes: [],
                include :[{
                    model: Webhook,
                    attributes: [],
                    required: true,
                    where: {
                        user_id : loggedInUser.discord_UID
                    }
                }]
            }]
        })
        

        
        res.status(200).json(altMethod);

    }
    public static async createNewRole(req: Request, res: Response){
        console.log('Creating New Role!');
        const {integration_id, role_id,role_name} = req.body;
        const {notification_type} = req.body || 0;

        if(!integration_id){
            res.status(400).json({message : "integration_id is Required!"});
            return;
        }

        const createdRole = await MentionRole.create({
            integration_id: integration_id,
            role_id: role_id,
            role_name: role_name,
            notification_type: notification_type
        })
        
        res.send(createdRole);

    }
    
}