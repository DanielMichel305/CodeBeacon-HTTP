import amqp from 'amqplib/callback_api';
require('dotenv').config();

//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created


///This needs some refactoring and more error/edgecase handling 
export class MQHandler {
    private instance : MQHandler | null; 
    private channel: amqp.Channel;
    private connection: amqp.Connection;

    public constructor(queueName: string, durable :boolean = true)  {       ///I kinda don't like this

        const rmqConnectionUrl : string = process.env.SCD_RMQ_URL as string;

        amqp.connect(rmqConnectionUrl,(err0,connection)=>{
            if(err0) throw err0; ///bad error handler
            connection.createChannel((err1,channel)=>{
                if(err1) throw err1;
                
                this.connection = connection
                this.channel = channel
        
                this.channel.assertQueue(queueName, {
                    durable: durable    ///JUST CHANGER THIISS
                });

                console.log("RMQ Connection success");

            });
        
        });

    }
    public sendMessage(queue: string , messageData : any){
        if(!this.channel || !this.connection){
            throw new Error('MessageQueueNotReady');

        }
        else{
            this.channel.sendToQueue(queue, Buffer.from(messageData), {
                persistent: true
            });
        }
       
    }
}





