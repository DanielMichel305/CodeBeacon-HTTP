import {Model, InferAttributes, InferCreationAttributes, DataTypes} from 'sequelize'
import { DBHandler } from './dbHandler';


const sequelize = DBHandler.getDBInstance();


export class BotInvites extends Model<InferAttributes<BotInvites>, InferCreationAttributes<BotInvites>>{

    declare user_id: string;
    declare guild_id: string;
}
BotInvites.init({
    user_id: {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    guild_id: {
        type: DataTypes.CHAR(32),
        allowNull: false
    }
},{
    sequelize,
    tableName:"bot_invites"
})

