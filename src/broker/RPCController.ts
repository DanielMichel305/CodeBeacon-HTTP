import { BotInvites } from "../api/models/botInvites";
import { MQListener } from "../utils/MQHandler";
import {Channel, ConsumeMessage} from 'amqplib'

export class RPCController extends MQListener{

    private proccessFuntion :(request: any)=>Promise<any>|null;       ///This is the actual function that does the message parsing, request to Function mapping and appropriate function Calls 

    constructor(channel :Channel, queueName: string, proccessFunction : (request: any) => Promise<any>){
        super(channel);
        this.proccessFuntion = proccessFunction;

            this.subscribe(queueName, {noAck: false})           ///This function was ack messages, move to handleMessage in case the proccess function crashes the message doesn't get lost. just a suggestion
            .catch(err=>{
                console.log(`[ERROR] Failed To Start RPC Queue Listener`);
            });

            this.on('messageReceived', this.handleMessage.bind(this))
       
            
        }
    
    private async handleMessage(message: ConsumeMessage){
        ///ERROR HANDLING

        const req = JSON.parse(message.content.toString());
        const res = await this.proccessFuntion(req);

        this.getChannel().sendToQueue(
            message.properties.replyTo,
            Buffer.from(JSON.stringify(res)),
            {
                correlationId : message.properties.correlationId
            }
        );
        //this.getChannel().ack(message);


    }

    

    }
/////Move to dedicated Class....if needed
export async function authGuildAccess(request: any){          ///return a JSON Object
    
    const {guild_id} = request;
    console.log(`[LOG] GUILD ID : ${guild_id}`)

    let statusMessage = {
        guild_id: guild_id,
        allowed: 0
    }

    const invite = await BotInvites.findOne({where: {guild_id: guild_id}});
    console.log(`[DB LOG] Invite fetched from db : ${invite}`)
    if(invite){
        statusMessage.allowed = 1;
        invite.destroy();
    }
    return statusMessage; 
    
}

