import express, {NextFunction, Request, Response, Router} from 'express';
import {webhookController} from '../controllers/webhookController';

const webhookRouter : Router = express.Router();

const authenticate = (req: Request,res: Response,next: NextFunction)=>{        ///Just a placeholder, would later be replaced with an actual auth controller
    const {webhookId, token} = req.params;
    console.log(req.params)
    if(!webhookId || !token){
        res.status(401).send(req.params);
    }
    else next();
};

webhookRouter.get('/root', webhookController.createWebhook);
webhookRouter.post('/:webhookId/:token', authenticate, webhookController.webhookListener)


webhookRouter.get('/:webhookId/:token', authenticate, (req,res)=>{
    
    res.send(`/api/webhooks/${req.params.webhookId}/${req.params.token}`);
});

export default webhookRouter;
