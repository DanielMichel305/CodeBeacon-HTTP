import express, {NextFunction, Request, Response, Router} from 'express';
import {webhookController} from '../../controllers/webhookController';

const webhookRouter : Router = express.Router();

const authenticate = (req: Request,res: Response,next: NextFunction)=>{        ///Just a placeholder, would later be replaced with an actual auth controller
    const {webhookid, token} = req.params;
    console.log(req.params)
    if(!webhookid || !token){
        res.status(401).send(req.params);
    }
    else next();
};

webhookRouter.get('/create', webhookController.createWebhook);
webhookRouter.get('/', webhookController.fetchUserWebhooks);
webhookRouter.post('/:webhookid/:token',authenticate, webhookController.webhookListener);

webhookRouter.head('/:webhookid/notification',webhookController.setupWebhookNotificationChannel);       ///temp remove the authenticate middleware

webhookRouter.get('/:webhookid/:token', authenticate, (req,res)=>{
    
    res.send(`/api/webhooks/${req.params.webhookId}/${req.params.token}`);
});

export default webhookRouter;
