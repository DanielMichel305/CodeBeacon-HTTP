import { randomBytes } from 'crypto';
import {DBHandler} from '../../models/dbHandler';
import {WebhookTokens} from '../../models/webhooktokensmodel';
import {Request, Response} from 'express';
import { Inspections } from '../../models/inpectionsmodel';
import {MQHandler, MQListener} from "../../utils/MQHandler";
import { Channel } from 'amqplib';

//const MQHandler = require('../utils/MQHandler-CrossCompatible')      //THIS IS SHITE
     ///This is just crude way to ensure connection creation (will be fixed)

MQHandler.url = process.env.SCD_RMQ_URL as string;


function getRepoNameFromUrl(url: string){
    const subStrings = url.split('/');
    return subStrings[4] + '/' + subStrings[5];
}


export const webhookController = {
    
    //initialize DB or sm
    async rootURI(req: Request  ,res: Response){
        const dbname = DBHandler.getDBInstance().databaseVersion();
        const description = await WebhookTokens.describe();
        if(!dbname || !description){
            res.send("NO DB Instance!"); ///crude way to test bas 
        }
        else res.send({
            status : "Success",
            description: description
        });
    },
    async createWebhook(req:Request,res:Response){          //this needs to protected behind user api / have auth
        const webhookId  = randomBytes(6).toString('hex'); ///find another way ?
        const token = randomBytes(10).toString('hex');
        //maybe have this part (discord channel) of the setup proccess bot side.
        const webhook = await WebhookTokens.create({webhook_id: webhookId, auth_token:token, discord_guild_id: ""});
        res.status(200).json({
            url:`/api/webhooks/${webhook.webhook_id}/${webhook.auth_token}`,     //fix the intellisense non existent error
            webhook: webhook.toJSON()
        });


    },
    async webhookListener(req :Request,res: Response){
        ///1-check webhook after authentication (already checked by 'fake' auth middleware)
        ///2-save sent data
        ///3-send/publish relative data into rabbit mq (implement MQ Handler) 
   
        const {webhookid, token} = req.params;
        const inspectionObejct = req.body.inspection;  ///refer to scrutinizer documentation
        const inspectionId = randomBytes(12).toString('hex');
        const inspectionState = inspectionObejct.state;
        const inspectionBuildStatus = inspectionObejct.build.status;
        const inspection_creation_date = inspectionObejct.created_at;
        const repo_name = getRepoNameFromUrl(inspectionObejct._links.repository.href);

        const inspection = await Inspections.create({inspection_id:inspectionId, state: inspectionState, build_status: inspectionBuildStatus, inspection_creation_date: inspection_creation_date , repo_name: repo_name ,  webhook_id : webhookid, inspection_json: JSON.stringify(inspectionObejct)});       ///Maybe wrap this in a try catch instead of creating this inspection const
        if(!inspection){ //success
            res.status(500).json({
                status : "Faliure",
                message : "server Error"
            })
        }
        
        const inspectionMessage = {
            repoName: repo_name,
            inspection_id : inspection.inspection_id,
            createdAt: inspection_creation_date, /// Maybe find a way to get the actual time of creation that was a couple ms ago...just maybe(FIXED)
            buildStatus : JSON.parse(inspection.inspection_json).status

        };  ///just doin this for logging

        
        /////////////// so a JSON needs to be stingifieddd first
        const user = await WebhookTokens.findOne({where : {webhook_id: webhookid}})
        console.log("USER CID = ", user?.discord_channel_id);
        
        const inspectionBody = {
            guildId: user?.discord_guild_id,
            discordChannel: user?.discord_channel_id,
            status : "sucess",
            inspectionData : inspectionMessage 
        }


        

        const channel : Channel = await MQHandler.createChannel('SCD-CH1');
        (await MQHandler.getInstance()).sendToQueue(channel,"SCD-INSPECTION-CREATE", Buffer.from(JSON.stringify(inspectionBody)))
        .then(()=>{
            res.status(200).json(inspectionBody);
        })
        .catch(err=>{
            console.log(`Error Sending Inpsection Data to Discord Bot, ${err}`);
            res.status(500).json({message: "Error Sending Inspection Data to Discord Bot"});

        })

    },
    async setupWebhookNotificationChannel(req: Request, res: Response){
        console.log('Setup Notifications channel \n\n   OLD ONEEEE AFTER HEADDD')
        res.status(200).json({message: "OK"})
        //return a short tansaction key maybe? 

        /*
            message = {
                webhookid,
                channelId
            }
        */ 


        
       
        // await MQHandler.connect();
        // const channel: Channel = await MQHandler.createChannel('SCD-CH1');
        // const queueListener = new MQListener(channel);
        // queueListener.subscribe('SCD-DISCORD-QUEUE',{noAck: false});

        // queueListener.on('messageReceived',async (msg)=>{
        //     if(!msg) console.log('received null message');
        //     msg = JSON.parse(msg.content.toString())
        //     await WebhookTokens.create({webhook_id: "556699",token:"null", discord_channel_id:" msg.channelId"});
        //     await MQHandler.getInstance().then(instance=>instance.close());
        // });

            
       

        //try a try-catch block for better error handling
        


    } 




    
}
