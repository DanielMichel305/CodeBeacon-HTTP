const router = require('express').Router();
const webhookRouter = require('./webhookRouter')

router.use('/webhooks', webhookRouter)

module.exports=router;