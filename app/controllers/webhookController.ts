import {DBHandler} from '../models/dbHandler';




export const webhookController = {
    
    //initialize DB or sm
    async rootURI(req,res){
        const dbname = DBHandler.getDBInstance().fetchDatabaseVersion();
        if(!dbname){
            res.send("NO DB Instance!"); ///crude way to test bas 
        }
        else res.send("CONN SUCCESS");
    }

    
}

//module.exports =  webhookController;