import { randomBytes } from 'crypto';
import {DBHandler} from '../models/dbHandler';
import {WebhookTokens} from '../models/webhooktokensmodel';
import {Request, Response} from 'express';
import { Inspections } from '../models/inpectionsmodel';
//import {MQHandler} from "../utils/MQHandler-CrossCompatible";           //Using the Cross Compatible version

//import { MQHandler } from 'rmq-handler/src/MQHandler';
import {MQHandler, MQListener} from "../utils/MQHandler";

//const MQHandler = require('../utils/MQHandler-CrossCompatible')      //THIS IS SHITE
const channel = new MQHandler('SCD-DISCORD-QUEUE');     ///This is just crude way to ensure connection creation (will be fixed)

(async()=>{
    await channel.initConnection();
})();
export const webhookController = {
    
    //initialize DB or sm
    async rootURI(req: Request  ,res: Response){
        const dbname = DBHandler.getDBInstance().databaseVersion();
        const description = await WebhookTokens.describe()
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
        const webhook = await WebhookTokens.create({webhook_id: webhookId, token:token});
        res.status(200).json({
            url:`/api/webhooks/${webhook.webhook_id}/${webhook.token}`,     //fix the intellisense non existent error
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
        const inspection = await Inspections.create({inspection_id:inspectionId , webhook_id : webhookid, inspection_json: JSON.stringify(inspectionObejct)})       ///Maybe wrap this in a try catch instead of creating this inspection const
        if(!inspection){ //success
            res.status(500).json({
                status : "Faliure",
                message : "server Error"
            })
        }
        
        const inspectionMessage = {
            inspection_id : inspection.inspection_id,
            createdAt: Date.now(), /// Maybe find a way to get the actual time of creation that was a couple ms ago...just maybe
            buildStatus : JSON.parse(inspection.inspection_json).status

        };  ///just doin this for logging
        channel.sendMessage('SCD-DISCORD-QUEUE', JSON.stringify(inspectionMessage)); // so a JSON needs to be stingifieddd first
        res.status(200).json({
            status : "sucess",
            inspectionData : inspectionMessage 
        });


    },
    async setupWebhookNotificationChannel(req: Request, res: Response){
        console.log('Setup Notifications channel')
        res.status(200).json({message: "OK"})
        //return a short tansaction key maybe? 

        /*
            message = {
                webhookid,
                channelid
            }
        */ 


        const channelListener = new MQListener(channel);
        await channelListener.init();
        console.log('awawa')
        channelListener.on('message',(msg)=>{
            console.log(JSON.stringify(msg));
        });

        //try a try-catch block for better error handling
        


    } 




    
}
