import {Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey} from 'sequelize'
import { DBHandler } from './dbHandler';
import { Webhook } from './webhooks';


class DiscordIntegration extends Model<InferAttributes<DiscordIntegration>, InferCreationAttributes<DiscordIntegration>> {

    declare integration_id : string;
    declare webhook_id :ForeignKey<Webhook['webhook_id']> //fk
    declare discord_guild_id : string;
    declare discord_channel_id : string;


}