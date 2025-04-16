import {Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey} from 'sequelize'
import { DBHandler } from './dbHandler';
import { Webhook } from './webhooks';
import { MentionRole } from './mentionRoles';

const sequelize = DBHandler.getDBInstance();

export class DiscordIntegration extends Model<InferAttributes<DiscordIntegration>, InferCreationAttributes<DiscordIntegration>> {

    declare integration_id : null;
    declare webhook_id :ForeignKey<Webhook['webhook_id']> //fk 
    declare discord_guild_id : string;
    declare discord_channel_id : string;


}

DiscordIntegration.init(
    {
        integration_id : {
            type : DataTypes.UUIDV4,
            defaultValue: DataTypes.UUIDV4,
            primaryKey : true
        },
        webhook_id :{
            type : DataTypes.CHAR(32),
            allowNull : false
        },
        discord_guild_id :{
            type : DataTypes.CHAR(32),
            allowNull: false
        },
        discord_channel_id  :{
            type : DataTypes.CHAR(32),
            allowNull : false
        }
    },
    {
        sequelize,
        tableName: "discord_integrations"
    })


