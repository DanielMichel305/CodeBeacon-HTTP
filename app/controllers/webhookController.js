const DBHandler = require('../models/dbHandler');




const webhookController = {
    
    //initialize DB or sm
    rootURI(req,res){
        const dbname = DBHandler.getDBInstance().authenticate();
        if(!dbname){
            res.send("NO DB Instance!"); ///crude way to test bas 
        }
        else res.send(dbname);
    }

    
}

module.exports=webhookController;