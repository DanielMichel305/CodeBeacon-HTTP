import { randomBytes } from 'crypto';
import {DBHandler} from '../models/dbHandler';
import {WebhookTokens} from '../models/webhooktokensmodel';
import {Request, Response} from 'express';
import { Inspections } from '../models/inpectionsmodel';
import {MQHandler} from "../utils/MQHandler";


export const webhookController = {
    
    //initialize DB or sm
    async rootURI(req,res){
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


        
        const {webhookId, token} = req.params;
        const inspectionObejct = req.body.inspection;  ///refer to scrutinizer documentation
        const inspectionId = randomBytes(12).toString('hex');       
        const inspection = await Inspections.create({inspection_id:inspectionId , webhook_id : webhookId, inspection_json: JSON.stringify(inspectionObejct)})       ///Maybe wrap this in a try catch instead of creating this inspection const
        if(inspection){ //success
            res.status(200).json({
                status : "sucess",
                inspection_id : inspection.inspection_id 
            });
        }
        else{
            res.status(500).json({
                status : "Faliure",
                message : "server Error"
            })
        }
        const channel = new MQHandler('SCD-DISCORD-QUEUE');
        channel.sendMessage('SCD-DISCORD-QUEUE', "HELLO");
        
    }




    
}
