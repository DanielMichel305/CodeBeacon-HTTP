import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize, UUIDV4 } from "sequelize";
import { DBHandler } from "./dbHandler";
import {DiscordIntegration} from './discordIntegration'
import { UUID } from "sequelize";



const sequelize = DBHandler.getDBInstance();


export class MentionRole extends Model<InferAttributes<MentionRole>, InferCreationAttributes<MentionRole>>{
    declare id: string | null;
    declare integration_id: ForeignKey<DiscordIntegration['integration_id']>;
    declare role_id: string;
    declare role_name: string;
    declare notification_type : number;
}


MentionRole.init(
    {
        id : {
            type: DataTypes.UUIDV4,
            defaultValue : DataTypes.UUIDV4,
            primaryKey: true
            
        },
        integration_id: {
            type: DataTypes.CHAR(20),
            allowNull: false
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

