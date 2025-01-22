import { randomBytes } from 'crypto';
import {DBHandler} from '../models/dbHandler';
import { webhook_tokens } from '../models/webhooktokensmodel';
import {Request, Response} from 'express';


export const webhookController = {
    
    //initialize DB or sm
    async rootURI(req,res){
        const dbname = DBHandler.getDBInstance().fetchDatabaseVersion();
        const description = await webhook_tokens.describe()
        if(!dbname || !description){
            res.send("NO DB Instance!"); ///crude way to test bas 
        }
        else res.send({
            status : "Success",
            description: description
        });
    },
    async createWebhook(req:Request,res:Response){
        ///1-generate WebhookId and Token
        ///2-store webhook 
        const webhookId  = randomBytes(6).toString('hex'); ///find another way ?
        const token = randomBytes(10).toString('hex');
        //maybe have this part (discord channel) of the setup proccess bot side.
        const webhook = await webhook_tokens.create({webhook_id: webhookId, token:token});
        res.status(200).json({
            url:`/api/webhooks/${webhook.webhook_id}/${webhook.token}`,
            webhook: webhook.toJSON()
        });


    },
    async webhookListener(req,res){
        ///1-check webhook after authentication
        ///2-save sent data
        ///3-send/publish relative data into rabbit mq (implement MQ Handler) 
    }




    
}
