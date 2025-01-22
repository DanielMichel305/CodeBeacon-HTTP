import { DBHandler } from "./dbHandler";
import {Sequelize, Model, Optional} from 'sequelize';
import {DataTypes} from "@sequelize/core";



export const webhook_tokens = DBHandler.getDBInstance().define('webhook_tokens', {
    
    webhook_id :{
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    token :{
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: true 
    },
    discord_channel_id :{
        type: DataTypes.CHAR(32)
    },
    date_created:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

});

try {           ////This code is shit//idk if it even works 😭(sob emoji)
    webhook_tokens.sync({alter:true});
}
catch(err){
    console.log("Error syncing DB");
}
