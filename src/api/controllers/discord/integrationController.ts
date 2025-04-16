import { DiscordUser } from '../../../utils/passport-config';
import { Request,Response } from 'express';
import { Webhook,DiscordIntegration,MentionRole, User} from '../../models/associations';

export class DiscordIntegrationController {

    public static async getUserDiscordIntegrations(req: Request, res: Response){
        const loggedInUser = req.user as DiscordUser;
        
        try{
            const userDiscordIntegrations = await Webhook.findAll({
                where : {
                    user_id : loggedInUser.discord_UID
                },
                attributes : [],
                include : [{
                    model : DiscordIntegration,
                    as : "discord_integration"
                }]
            })
            res.status(200).json((userDiscordIntegrations[0] as any).discord_integration);      
        }
        catch{
            res.status(500).json({message : "Server Error, Try again later!"});
        }
        

    }
    public static async createDiscordIntegration(req: Request, res: Response){
        const {webhook_id, discord_guildId, discord_channelId} = req.body;

        if(!webhook_id || !discord_channelId || !discord_guildId){
            
            res.status(400).json({message : "webhook_id, discord_guildId and discord_channelId are all required!"});
        }

        try {
            const createdIntegration = await DiscordIntegration.create({
                webhook_id: webhook_id,
                discord_guild_id: discord_guildId, 
                discord_channel_id:discord_channelId
            })

            res.status(200).json(createdIntegration);     
        } 
        catch(err){
            console.log(`[DB ERROR] Error: ${err}`);
            res.status(500).json({message : "Server Error, Try again later!"});
        }

    }
    public static async getWebhookDiscorIntegrations(req: Request, res: Response){
        const {wid} = req.params;
        try{
            const userDiscordIntegrations = await Webhook.findAll({
                where : {
                    webhook_id : wid
                },
                attributes : [],
                include : [{
                    model : DiscordIntegration,
                    as : "discord_integration"
                }]
            })
            res.status(200).json((userDiscordIntegrations[0] as any).discord_integration);      
        }
        catch{
            res.status(500).json({message : "Server Error, Try again later!"});
        }
    }

}