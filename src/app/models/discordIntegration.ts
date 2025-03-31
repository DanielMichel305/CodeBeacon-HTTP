import {Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey} from 'sequelize'
import { DBHandler } from './dbHandler';
import { Webhook } from './webhooks';

const sequelize = DBHandler.getDBInstance();

export class DiscordIntegration extends Model<InferAttributes<DiscordIntegration>, InferCreationAttributes<DiscordIntegration>> {

    declare integration_id : string;
    declare webhook_id :ForeignKey<Webhook['webhook_id']> //fk
    declare discord_guild_id : string;
    declare discord_channel_id : string;


}

DiscordIntegration.init(
    {
        integration_id : {
            type : DataTypes.CHAR(20),
            allowNull : false,
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


DiscordIntegration.sync({ alter: true })  
  .then(() => {
    console.log('discord_integrations Table synced');
  })
  .catch(err => {
    console.error('Failed to sync discord_integrations table:', err);
  });
