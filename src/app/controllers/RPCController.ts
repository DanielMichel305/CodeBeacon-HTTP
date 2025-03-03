import { MQListener } from "../utils/MQHandler";
import {Channel, ConsumeMessage} from 'amqplib'

export class RPCController extends MQListener{

    private proccessFuntion :(request: any)=>Promise<any>|null;       ///This is the actual function that does the message parsing, request to Function mapping and appropriate function Calls 

    constructor(channel :Channel, queueName: string, proccessFunction : (request: any) => Promise<any> | null){
        super(channel);
        this.proccessFuntion = proccessFunction;

            this.subscribe(queueName, {noAck: false})
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
        this.getChannel().ack(message);


    }

    public defaultProccessFunction(request: any){
        console.log(`RECEIVED A REQUEST ${request}`)
    }

    }

