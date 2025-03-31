import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { DBHandler } from "./dbHandler";

const sequelize = DBHandler.getDBInstance();


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare discord_UID : string;
    declare username: string;
    declare email: string;
    declare verified: boolean;
}

User.init({
    discord_UID:{
        type: DataTypes.CHAR(20),
        primaryKey: true
        
    },
    username : {
        type: DataTypes.CHAR(32),
        allowNull: false
    },
    email :{
        type: DataTypes.STRING,
        allowNull: true
    },
    verified:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
        
    }
},{
    sequelize,
    tableName: "users"
});


User.sync({ alter: true })  
  .then(() => {
    console.log('webhook_tokens Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });
