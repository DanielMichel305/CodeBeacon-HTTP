import { DBHandler } from "../../models/dbHandler";
import { Request, Response } from "express";
import { MentionRole } from "../../models/mentionRoles";
import { NotificationChannel } from "../../models/notificationChannelModel";
import { WebhookTokens } from "../../models/webhooktokensmodel";
import { Inspections } from "../../models/inpectionsmodel";



type GuildChannel = {

    id: string,
    type: number,
    flags: 0,
    guild_id: string,
    name: string,
    parent_id: string,
    position: number,

}


export default class DashboardApiController{

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

        const userGuildChannel = await DashboardApiController.fetchGuildChannels(guildId);
        const filteredChannels = DashboardApiController.filterGuildChannels(userGuildChannel) as GuildChannel[]
        
        const guildRoles = await DashboardApiController.fetchGuildRoles(guildId);


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

}