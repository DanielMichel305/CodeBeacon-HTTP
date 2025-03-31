import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DBHandler } from "./dbHandler";
import {DiscordIntegration} from './discordIntegration'

const sequelize = DBHandler.getDBInstance();


export class MentionRole extends Model<InferAttributes<MentionRole>, InferCreationAttributes<MentionRole>>{
    declare integration_id: ForeignKey<DiscordIntegration['integration_id']>;
    declare role_id: string;
    declare role_name: string;
    declare notification_type : number;
}


MentionRole.init(
    {
        integration_id: {
            type: DataTypes.CHAR(20),
            primaryKey: true
        },
        role_id:{
            type: DataTypes.CHAR(20),
            allowNull: false
        },
        role_name :{
            type : DataTypes.CHAR(32)
        },
        notification_type:{
            type: DataTypes.SMALLINT(),
            defaultValue: 0
        }
    },
    {
    sequelize,
    tableName:"mention_roles"
    }
)



MentionRole.sync({ alter: true })  
  .then(() => {
    console.log('mention_roles Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });
