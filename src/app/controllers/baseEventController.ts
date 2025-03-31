import { MQHandler, MQListener } from "../utils/MQHandler";
import {Channel, ConsumeMessage} from 'amqplib';
import {WebhookTokens} from '../models/webhooks';
import { NotificationChannel } from "../models/notificationChannelModel";
import { MentionRole } from "../models/mentionRoles";

export class BaseEventController {

    private queueListener? : MQListener;

    public constructor(){}

    public async init(){

        MQHandler.url = process.env.SCD_RMQ_URL as string;
        await MQHandler.connect();

    }
    /** DEPRECATED */
    public async onMessageReceived(fn: Function, args: any[]) : Promise<any>{

        this.queueListener?.on('messageReceived', async ()=>{
            const returns = await fn(...args);
            if(returns) return returns;
        });
    }

    public getMQListener(){
        return this.queueListener;
    }

    public async startMessageQueueListener(channelName: string){
        const channel: Channel = await MQHandler.createChannel(channelName);

        const botChannelSetupEventListener = new MQListener(channel);
        botChannelSetupEventListener.subscribe('SCD-BOT-SETUP', {noAck: false});
        botChannelSetupEventListener.on('messageReceived', (msg: ConsumeMessage)=>{
            const setupData = JSON.parse(msg.content.toString());
            console.log(`RECEIVED DATA IN QUEUE 'SCD-BOT-SETUP'. RAW DATA ${JSON.stringify(setupData)}`);
            this.botChannelSetupRoutine(setupData);
        })

        const botMentionRoleEventListener = new MQListener(channel);
        botMentionRoleEventListener.subscribe('SCD-BOT-ROLE', {noAck: false});
        botMentionRoleEventListener.on('messageReceived', (msg: ConsumeMessage)=>{
            const setupData = JSON.parse(msg.content.toString());
            console.log(`RECEIVED DATA IN QUEUE 'SCD-BOT-ROLE'. RAW DATA ${JSON.stringify(setupData)}`);
            this.botMentionRoleSetupRoutine(setupData);
        })


    }

    public async botChannelSetupRoutine(setupData: any){       ///change any to messageType
        await WebhookTokens.update({ discord_channel_id: setupData.channelId, discord_guild_id: setupData.guildID},{where: {webhook_id: setupData.webhookId}});
        await NotificationChannel.findOrCreate(
            {
                where:{webhook_id: setupData.webhookId, discord_channel_id: setupData.channelId},
                defaults:{
                    webhook_id: setupData.webhook_id,
                    discord_channel_id: setupData.channelId,
                    notification_type: 0        ///DEFAULT VALUE
                }
            })
        console.log('AGOGOAGAGA EGAGA AOAAGAGA');
    }

    public async botMentionRoleSetupRoutine(data: any){
        console.log("EDITING ROLES")
        console.log(`----------------------------->${data.channelId}`);
        const channel = await NotificationChannel.findOne({where:{discord_channel_id:data.channelId}});
        
        if(!channel){return;} ///Just fix this

        const [role, created] = await MentionRole.findOrCreate({
            where: {webhook_id: channel.webhook_id, role_id: data.role_id},
            defaults:{
                webhook_id:channel.webhook_id,
                role_id:data.role_id,
                role_name :data.role_name,
                notification_type: data.notification_type || 0
            }
        });
       
        if(created){
            console.log("NEW ROLE WAS ADDED")
        }
        console.log(`${channel.webhook_id} webhook created/updated their roles`);
    }

    
}


