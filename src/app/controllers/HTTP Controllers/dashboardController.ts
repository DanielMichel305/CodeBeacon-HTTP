import { DBHandler } from "../../models/dbHandler";
import { Request, Response } from "express";
import { MentionRole } from "../../models/mentionRoles";
import { WebhookTokens } from "../../models/webhooks";
import { BotInvites } from "../../models/botInvites";
import AuthController from './authController';

interface DiscordUser {
    discord_UID: string;
    username: string;
    accessToken: string;
    refreshToken : string;
  }

type Guild = {
    id: string
}


type GuildChannel = {

    id: string,
    type: number,
    flags: 0,
    guild_id: string,
    name: string,
    parent_id: string,
    position: number,

}


export default class DashboardController{

    constructor(){
        
    }


   
    private static async fetchGuildRoles(guildId: string){
        console.log(`[LOG] FETCHING ${guildId} Channels`)
        const accessToken = process.env.DISCORD_TOKEN as string;
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`,{
            headers : {
                Authorization : `Bot ${accessToken}`
            }
        })
        console.log(`[INFO] RESPONSE STATUS: ${response.status}`);
        if(response.ok){
            console.log(`[INFO] FETCHED USER GUILDS`)
            return await response.json();
        }
     
        
    }

     

    private static async fetchGuildChannels(guildId: string){
        console.log(`[LOG] FETCHING ${guildId} Channels`)
        const accessToken = process.env.DISCORD_TOKEN as string;
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`,{
            headers : {
                Authorization : `Bot ${accessToken}`
            }
        })
        console.log(`[INFO] RESPONSE STATUS: ${response.status}`);
        if(response.ok){
            console.log(`[INFO] FETCHED USER GUILDS`)
            
            
            return await response.json();
        }
        
    }


    private static filterGuildChannels(guildChannels: Array<GuildChannel>){
        const channels =  guildChannels.filter((guild)=>
            (guild.type === 4 || guild.type === 0)
        )
        const sanitizedChannels : GuildChannel[] = channels.map(channel=> ({
            id: channel.id,
            type: channel.type,
            guild_id: channel.guild_id,
            name: channel.name,
            parent_id: channel.parent_id,
            position: channel.position

        } as GuildChannel))
        return sanitizedChannels;
        
    }


    private static async fetchBotGuildList(){
        const BOT_Token = process.env.DISCORD_TOKEN as string;
        const response = await fetch("https://discord.com/api/v10/users/@me/guilds" ,{
            headers :{
                Authorization : `Bot ${BOT_Token}`
            }
        })
        if(!response.ok){
            console.log(`[ERROR] Failed to fetch Bot Guilds`)
            return new Set();
        }
        const botGuilds :Guild[] = await response.json();
        return new Set(botGuilds.map(guild=>guild.id)); 

    }


    private static async getUserManagedGuilds(userGuilds: any){
        const userManagedGuilds = AuthController.filterUserManagedGuilds(userGuilds);
        const botGuilds = await DashboardController.fetchBotGuildList();
        const commonGuilds = userManagedGuilds.map((guild)=>({
            ...guild,
            existing_member: botGuilds.has(guild.id)
        }));
        return commonGuilds;
    }


    public async serveDashboard(req: Request, res: Response){
        if(req.user){
            let userArray = req.user as any[];
            const user = userArray[0] as DiscordUser 
            console.log(`[LOG ] Access Token : ${req.session.user?.accessToken}`);
            const userGuilds = await AuthController.getUserGuilds(req.session.user!.accessToken as string) || null;            ///THIS WON'T WORK BARDO SINCE ACCESS TOKEN EXPIRES IN 1 HOUR AND WE EFFIN STORE THE ACCESS TOKEN
            const userManagedGuilds = await DashboardController.getUserManagedGuilds(userGuilds) || null;
            

            res.render('dashboard', {guilds: userManagedGuilds, user: req.session.user})
        }
        
    }


    public async inviteBot(req:Request, res:Response){
        const {userId, guildId} = req.body;
        if(!userId || !guildId){
            res.status(400).json(
                {
                    message: "required parameters userId and guildId are missing in the request body."
                }
            )
        }
        else{
            const invite = await BotInvites.findOrCreate({where: {guild_id:guildId}, 
                defaults : {
                    user_id: userId,
                    guild_id: guildId
                }
            })
            if(invite){
                res.status(200).json(
                    {
                        message : "Invite Generated successfully"
                    }
                )
            }

        }
        
    } 


    public async getGuildSettings(req: Request, res: Response){
        //do Auth and auth first
        const {guildId} = req.params;
        const webhook = await WebhookTokens.findOne({ 
            attributes :
            [
                'webhook_id', 
                'discord_channel_id', 
                'discord_guild_id', 
                'createdAt'
            ],
             where: {
                discord_guild_id: guildId
            }
        });

        const currentMentionRoles = await MentionRole.findAll({
            attributes :
            [
                'role_id',
                'role_name', 
                'notification_type',

            ],
            where : {
                webhook_id: webhook?.webhook_id
            }
        }) || "Not Set";

        const userGuildChannel = await DashboardController.fetchGuildChannels(guildId);
        const filteredChannels = DashboardController.filterGuildChannels(userGuildChannel) as GuildChannel[]
        
        const guildRoles = await DashboardController.fetchGuildRoles(guildId);


        const response = {
            webhookData : webhook,
            guild_settings:{
                channels : {
                    notificationChannel : webhook?.discord_channel_id,
                    avilabeChannels : filteredChannels
                },
                roles : {
                    current_mention_role : currentMentionRoles,
                    avilable_roles: guildRoles
                }
            }
            
        }
        res.json(response);
    }


    public async inviteBotInstance(req: Request, res: Response){
        
        const {guildId} = req.params;
        const userArray = req.user as any[];
        const user = userArray[0] as DiscordUser 

        console.log(`[LOG] Generating an Invite for ${guildId}. User Id : ${JSON.stringify(user.discord_UID)}`)

        const [invite,created] = await BotInvites.findOrCreate({where: {guild_id:guildId}, 
            defaults : {
                user_id: user.discord_UID,
                guild_id: guildId
            }
        })
        if(invite){
            res.redirect(`https://discord.com/oauth2/authorize?client_id=1332364038885216266&permissions=19456&scope=bot&guild_id=${guildId}&disable_guild_select=true`)
        }
        res.status(500).send('Failed To Generate an Invite, Try again later.');


    }

}