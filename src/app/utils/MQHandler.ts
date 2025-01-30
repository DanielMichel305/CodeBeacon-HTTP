import * as amqp from "amqplib";
//const amqp = require('amqplib/callback_api');
require('dotenv').config();

//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created



///This needs some refactoring and more error/edgecase handling 
export class MQHandler {
    private instance : MQHandler | null = null; 
    private channel: amqp.Channel | null = null;
    private connection: amqp.Connection | null=null;
    


    public constructor(private queueName: string,private durable :boolean = true)  {}       ///I kinda don't like this ///Better??


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
    public async listenToQueue(queueName: string = this.queueName){
        if(!this.channel){
            console.error("Channel Not Initialized!");
            return;
        }
        this.channel.assertQueue(queueName, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);

        this.channel.consume(queueName, function(msg: amqp.Message | null) {
            console.log(" [x] Received %s", msg?.content.toString());
        }, {
            noAck: false
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
}





