import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DBHandler } from "./dbHandler";
import { Webhook } from "./webhooks";

const sequelize = DBHandler.getDBInstance();

export class NotificationChannel extends Model<InferAttributes<NotificationChannel>, InferCreationAttributes<NotificationChannel>>{
    declare webhook_id: ForeignKey<Webhook['webhook_id']>;
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
