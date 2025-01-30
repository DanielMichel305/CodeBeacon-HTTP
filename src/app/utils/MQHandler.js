"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQHandler = void 0;
var amqp = require("amqplib/callback_api");
//const amqp = require('amqplib/callback_api');
require('dotenv').config();
//This class can either be a singleton and hae a way to create multiple channels and have them accessible anywhere in the code.
//OR just be a normal class and when multiple channels are required then multiple objects are created
///This needs some refactoring and more error/edgecase handling 
var MQHandler = /** @class */ (function () {
    function MQHandler(queueName, durable) {
        if (durable === void 0) { durable = true; }
        var _this = this;
        this.instance = null;
        this.channel = null;
        this.connection = null;
        var rmqConnectionUrl = process.env.SCD_RMQ_URL;
        amqp.connect(rmqConnectionUrl, function (err0, connection) {
            if (err0)
                throw err0; ///bad error handler
            connection.createChannel(function (err1, channel) {
                if (err1)
                    throw err1;
                _this.connection = connection;
                _this.channel = channel;
                _this.channel.assertQueue(queueName, {
                    durable: durable ///JUST CHANGER THIISS
                });
                console.log("RMQ Connection success");
            });
        });
    }
    MQHandler.prototype.sendMessage = function (queue, messageData) {
        if (!this.channel || !this.connection) {
            throw new Error('MessageQueueNotReady');
        }
        else {
            this.channel.sendToQueue(queue, Buffer.from(messageData), {
                persistent: true
            });
        }
    };
    MQHandler.prototype.listenToQueue = function (queueName) {
        if (!this.channel) {
            console.error("Channel Not Initialized!");
            return;
        }
        this.channel.assertQueue(queueName, {
            durable: true
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
        this.channel.consume(queueName, function (msg) {
            console.log(" [x] Received %s", msg === null || msg === void 0 ? void 0 : msg.content.toString());
        }, {
            noAck: false
        });
    };
    return MQHandler;
}());
exports.MQHandler = MQHandler;
