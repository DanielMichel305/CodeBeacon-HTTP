const amqp = require('amqplib/callback_api');
require('dotenv').config();

//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created


///This needs some refactoring and more error/edgecase handling 
class MQHandler {
    
    #channel
    #connection

    constructor(queueName, durable  = true)  {       ///I kinda don't like this

        const rmqConnectionUrl = process.env.SCD_RMQ_URL ;

        amqp.connect(rmqConnectionUrl,(err0,connection)=>{
            if(err0) throw err0; ///bad error handler
            this.#connection.createChannel((err1,channel)=>{
                if(err1) throw err1;
                
                this.#connection = connection
                this.#channel = channel
        
                this.#channel.assertQueue(queueName, {
                    durable: durable    ///JUST CHANGER THIISS
                });

                console.log("RMQ Connection success");

            });
        
        });

    }
    sendMessage(queue , messageData ){
        if(!this.#channel || !this.#connection){
            throw new Error('MessageQueueNotReady');

        }
        else{
            this.channel.sendToQueue(queue, Buffer.from(messageData), {
                persistent: true
            });
        }
       
    }
    listenToQueue(queue){
        this.#channel.assertQueue(queue, {
            durable: true
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        this.#channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: false
        });
    
    }


}





module.exports = MQHandler;