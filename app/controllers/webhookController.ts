import {DBHandler} from '../models/dbHandler';
import { webhook_tokens } from '../models/webhooktokens';



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
    }

    
}

//module.exports =  webhookController;