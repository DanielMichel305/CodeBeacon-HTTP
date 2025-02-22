import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DBHandler } from "./dbHandler";
import { WebhookTokens } from "./webhooktokensmodel";

const sequelize = DBHandler.getDBInstance();

export class NotificationChannel extends Model<InferAttributes<NotificationChannel>, InferCreationAttributes<NotificationChannel>>{
    declare webhook_id: ForeignKey<WebhookTokens['webhook_id']>;
    declare discord_channel_id : string;
    declare notification_type : number;
}

NotificationChannel.init({
    webhook_id: {
        type: DataTypes.CHAR(32)
    },
    discord_channel_id :{
        type: DataTypes.CHAR(20)
    },
    notification_type:{
        type: DataTypes.SMALLINT(),
        defaultValue: 0
    }
    },
    {
        sequelize,
        tableName: 'notification_channels'
    }

);

NotificationChannel.sync({alter:true})
.then(()=>{
    console.log("NotificationChannel Model synced.")
})
.catch((err)=>{
    console.log(`An Error Occured when Syncing NotificationChannel Model ${err}`);
})