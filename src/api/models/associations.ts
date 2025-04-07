import { BotInvites } from "./botInvites";
import { DiscordIntegration } from "./discordIntegration";
import { Inspections } from "./inpectionsmodel";
import { MentionRole } from "./mentionRoles";
import { NotificationChannel } from "./notificationChannelModel";
import { User } from "./user";
import { Webhook } from "./webhooks";

DiscordIntegration.hasMany(MentionRole, {
    foreignKey: 'integration_id',
    sourceKey : 'integration_id'
   }) 



  
MentionRole.belongsTo(DiscordIntegration, {
    foreignKey: 'integration_id',
    targetKey: 'integration_id',
    constraints: false
  });




  
  
  User.hasMany(Webhook, {
      foreignKey: 'user_id',
      sourceKey : 'discord_UID'
  })
  

  Webhook.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'discord_UID',
    constraints: false
  });


Webhook.hasMany(DiscordIntegration,{
    foreignKey: 'webhook_id',
    sourceKey : 'webhook_id',
    as: 'discord_integration'
})




  User.sync({ alter: true })  
    .then(() => {
      console.log('webhook_tokens Table synced');
    })
    .catch(err => {
      console.error('Failed to sync webhook_tokens table:', err);
    });
  


    

Webhook.sync({ alter: true })  
  .then(() => {
    console.log('webhook_tokens Table synced');
  })
  .catch(err => {
    console.error('Failed to sync webhook_tokens table:', err);
  });


  
MentionRole.sync({ alter: true })  
.then(() => {
  console.log('mention_roles Table synced');
})
.catch(err => {
  console.error('Failed to sync webhook_tokens table:', err);
});


DiscordIntegration.sync({ alter: true })  
  .then(() => {
    console.log('discord_integrations Table synced');
  })
  .catch(err => {
    console.error('Failed to sync discord_integrations table:', err);
  });


  NotificationChannel.sync({alter:true})
  .then(()=>{
      console.log("NotificationChannel Model synced.")
  })
  .catch((err)=>{
      console.log(`An Error Occured when Syncing NotificationChannel Model ${err}`);
  })



  Inspections.sync({ alter: true })  
    .then(() => {
      console.log('Inspection Table synced');
    })
    .catch(err => {
      console.error('Failed to sync Inspections table:', err);
    });
  


    BotInvites.sync({alter:true})
.then(()=>{
    console.log(`bot_invites table synced to BotInvites Model `)
})
.catch(()=>{
    console.log('[DB ERROR] Error Syncing bot_invites table to BotInvites Model');
})
  

export {DiscordIntegration, Webhook, User, MentionRole, NotificationChannel, Inspections}