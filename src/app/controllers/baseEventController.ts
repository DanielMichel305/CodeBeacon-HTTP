import { MQHandler, MQListener } from "../utils/MQHandler";
import {Channel, ConsumeMessage} from 'amqplib';
import {WebhookTokens} from '../models/webhooktokensmodel';

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

    public async startMessageQueueListener(channelName: string){
        const channel: Channel = await MQHandler.createChannel(channelName);

        const botSetupEventListener = new MQListener(channel);
        botSetupEventListener.subscribe('SCD-BOT-SETUP', {noAck: false});
        botSetupEventListener.on('messageReceived', (msg: ConsumeMessage)=>{
            const setupData = JSON.parse(msg.content.toString());
            console.log(`RECEIVED DATA IN QUEUE 'SCD-BOT-SETUP'. RAW DATA ${JSON.stringify(setupData)}`);
            this.botSetupRoutine(setupData);
        })


    }

    public async botSetupRoutine(setupData: any){       ///change any to messageType
        await WebhookTokens.create({webhook_id: setupData.webhookId,token:"null", discord_channel_id: setupData.channelId, discord_guild_id: setupData.guildID});
        console.log('AGOGOAGAGA EGAGA AOAAGAGA');
    }

    
}


