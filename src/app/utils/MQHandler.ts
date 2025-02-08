import * as amqp from "amqplib";
import {EventEmitter} from "events";
//const amqp = require('amqplib/callback_api');
require('dotenv').config();

//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created



///This needs some refactoring and more error/edgecase handling 

export class MQListener extends EventEmitter {

    private messageQueueHandler: MQHandler;

    constructor(mqHandler: MQHandler){
        super();
        this.messageQueueHandler = mqHandler;
    }
    public async init(){        ///I don't like this 5ales bardo
        await this.messageQueueHandler.getChannel()?.assertQueue(this.messageQueueHandler.getQueueDefaultName())
        this.messageQueueHandler.getChannel()?.consume(this.messageQueueHandler.getQueueDefaultName(), (msg)=>{
            if(msg) {
                this.emit(`message`, msg.content.toString());
                this.messageQueueHandler.getChannel()?.ack(msg)
            }
        },{noAck:false});
    }

}



export class MQHandler{
    private instance : MQHandler | null = null; 
    private channel: amqp.Channel | null = null;
    private connection: amqp.Connection | null=null;
    


    public constructor(private queueName: string,private durable :boolean = true)  {
        this.initConnection
    }       ///I kinda don't like this ///Better??


    public async initConnection(){

        const rmqConnectionUrl : string = process.env.SCD_RMQ_URL as string;
        try {
            this.connection = await amqp.connect(rmqConnectionUrl);
            this.channel = await this.connection.createChannel();
            
        } catch (error) {
            console.warn("Error initializing connection:\n", error);

        }
       
    }
    public async sendMessage(queueName: string = this.queueName , messageData : any){
        if(!this.channel || !this.connection){
            throw new Error('MessageQueueNotReadyError');
        }
        else{
            this.channel.assertQueue(queueName)
            this.channel.sendToQueue(queueName, Buffer.from(messageData), {
                persistent: true
            });
        }
       
    }
    public async consumeLatest(queueName: string = this.queueName, timeoutMS : number = 2000){         ///Do better Error Handling
        if(!this.channel){
            console.error("Channel Not Initialized!");
            return;
        }
        this.channel.assertQueue(queueName, {
            durable: true
        });

        //console.log(" [*] Waiting for messages in %s.", queueName);

        return new Promise((resolve)=>{
            const timeout = setTimeout(()=>{
                resolve(null)
            },timeoutMS);

            this.channel?.consume(queueName, (msg: amqp.Message| null)=>{
                if(msg){
                    clearTimeout(timeout)
                    this.channel?.ack(msg);
                    resolve(msg);
                }
            },{
                noAck:false
            });
        });
    
    }
    public async attachQueueFunction(queueName: string=this.queueName, callback: (data: string)=> unknown){
        if(!this.channel){
            console.error("Channel Not Initialized!");
            return;
        }
        this.channel.assertQueue(queueName, {
            durable: true
        });
        this.channel.consume(queueName, function(msg: amqp.Message|null){
            if(!msg){
                return;
            }
            callback(msg.toString())
        });
    }
    public async close(){
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        console.log('RabbitMQ connection closed');
    }
    public getChannel(): amqp.Channel | null{       ///I DOn't this 5ales
        return this.channel;
    }
    public getQueueDefaultName(): string{
        return this.queueName;
    }
}





