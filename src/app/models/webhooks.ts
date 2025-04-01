import { DBHandler } from "./dbHandler";
import {Model, InferAttributes, InferCreationAttributes,DataTypes, ForeignKey} from 'sequelize';
import { User } from "./user";
import { DiscordIntegration } from "./discordIntegration";


const sequelize = DBHandler.getDBInstance();



export class Webhook extends Model<InferAttributes<Webhook>,InferCreationAttributes<Webhook>>{

    declare user_id : ForeignKey<User['discord_UID']>;
    declare webhook_id: string;
    declare auth_token: string;
    declare repo_name : string;
    declare webhook_status : boolean;

}

Webhook.init({
        user_id :{
            type : DataTypes.CHAR(20),
            allowNull: false
        },
        webhook_id :{
            type: DataTypes.CHAR(32),
            allowNull: false, /////alowNull, unique and pk should be true!
            unique: false,
            primaryKey: true
        },
        auth_token :{
            type: DataTypes.CHAR(32),
            allowNull: true,
            unique: true 
        },
        repo_name :{
            type : DataTypes.CHAR(32),
            allowNull: true,
            defaultValue : "N/A"
        },
        webhook_status : {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue : true
        }

        

    },
    {
        sequelize,
        tableName:'webhooks'
    }
);
