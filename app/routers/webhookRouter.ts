import express, {Router} from 'express';
import {webhookController} from '../controllers/webhookController';

const webhookRouter : Router = express.Router();

const authenticate = (req,res,next)=>{        ///Just a placeholder, would later be replaced with an actual auth controller
    const {webhookId, token} = req.params;
    console.log(req.params)
    if(!webhookId || !token){
        res.status(401).send(req.params);
    }
    else next();
};

webhookRouter.get('/root', webhookController.createWebhook);


webhookRouter.get('/:webhookId/:token', authenticate, (req,res)=>{
    //https://discord.com/api/webhooks/1329203449035886652/eA8N4__rYZ8u9ba594_Z81mj3tK_ooL6u4WVVYTrcx5y7JJr1o-5te4sGZKHyQ32wuoK
    res.send(`/api/webhooks/${req.params.webhookId}/${req.params.token}`);
});

export default webhookRouter;