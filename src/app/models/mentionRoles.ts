import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DBHandler } from "./dbHandler";
import { WebhookTokens } from "./webhooktokensmodel";

const sequelize = DBHandler.getDBInstance();


export class MentionRole extends Model<InferAttributes<MentionRole>, InferCreationAttributes<MentionRole>>{
    declare webhook_id: ForeignKey<WebhookTokens['webhook_id']>;
    declare role_id: string;
    declare notification_type : number;
}


MentionRole.init(
    {
        webhook_id: {
            type: DataTypes.CHAR(32),
            primaryKey: true
        },
        role_id:{
            type: DataTypes.CHAR(20),
            allowNull: false
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



WebhookTokens.sync({ alter: true })  
  .then(() => {
    console.log('webhook_tokens Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });
