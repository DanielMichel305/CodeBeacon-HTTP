
var amqp = require('amqplib/callback_api');
require('dotenv').config();

import {MQHandler} from "./app/utils/MQHandler"

console.log('AWAWA---')
const mqhndlr = new MQHandler('SCD-DISCORD-QUEUE', true);


async function init(){
    console.log('AWAWA')
    
    console.log("--------");
    await mqhndlr.initConnection()
    await mqhndlr.listenToQueue("SCD-DISCORD-QUEUE");

}
init();



