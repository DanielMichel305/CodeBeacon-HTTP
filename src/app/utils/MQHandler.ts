import * as amqp from "amqplib";
import {EventEmitter} from "events";
import {} from 'dotenv/config'

//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created(NO AIN'T GONNA HAPPEN)



///This needs some refactoring and more error/edgecase handling 
//make this singleton??


export class MQListener extends EventEmitter{



    private channel: amqp.Channel

    public constructor(channel: amqp.Channel){
        super();
        this.channel = channel;

    }
    public getChannel() : amqp.Channel{
        return this.channel;
    }
    public async subscribe(queue: string, options: amqp.Options.Consume){
        await this.channel.assertQueue(queue, {durable:true});
        this.channel.consume(queue,(msg)=>{
            if(msg){
                this.emit("messageReceived", msg);
                this.channel.ack(msg);
            }
            else{
                console.log("Null message Received");
            }
        },options);
    }

    

}


export class MQHandler{

    private static instance: MQHandler 
    private static connection? : amqp.Connection;
    private static channels: Map<string, amqp.Channel>
    public static url: string

    private  constructor(){
        
    }


    public static async getInstance() : Promise<MQHandler>{
        if(!MQHandler.instance){
            MQHandler.instance = new MQHandler();
            MQHandler.connect()
            return this.instance;
        }
        else{
            return MQHandler.instance;
        }
    }

    public static async connect() : Promise<amqp.Connection>{
        console.log('Initializing RMQ Connection');
        try {
            MQHandler.connection = await amqp.connect(MQHandler.url);
            console.log('Connection to RMQ initialized');
            return MQHandler.connection;
        } catch (error) {
            throw error;
        }

    }
    
    public static async createChannel(channelName: string): Promise<amqp.Channel>{
        if(!MQHandler.connection) {
            throw new Error("RabbitMQ Connection not initialized, Call connect() first");
        }
        if(this.channels?.has(channelName)){
            return this.channels.get(channelName)!;
        }
        const channel = await MQHandler.connection.createChannel();
        this.channels?.set(channelName, channel);
        return channel;
    }
    public async sendToQueue(channel: amqp.Channel, queue: string, message: Buffer | any, options?: amqp.Options.Publish): Promise<void>{ ////any just so I can send anything I want (ideally would be just buffer/json)
        
        try{
            await channel.assertQueue(queue, {durable: true}) /// force true for now
            channel.sendToQueue(queue,message,options);

        }
        catch{
            throw new Error("Queue assertion failed");
        }
        
    }

    public async publish(channel: amqp.Channel, exchange: string, routingKey: string, exchangeType: string = 'direct', message: Buffer | any, options? : amqp.Options.Publish) : Promise<void> {
        try {
            await channel.assertExchange(exchange, exchangeType, {durable: true});
            channel.publish(exchange,routingKey,message,options);
        } catch (error) {
            throw error;
        }
    }

    public async close(): Promise<void>{
        if(MQHandler.channels){
            for(const channel of MQHandler.channels.values()){
                await channel.close()
            }
        }
        if(MQHandler.connection){
            await MQHandler.connection.close();
        }
        console.log("Closed all channels and terminated RMQ Connection");
        
    }



}


