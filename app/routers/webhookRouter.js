const express = require('express');
const webhookController = require('../controllers/webhookController')

const router = express.Router();

const authenticate = (req,res,next)=>{        ///Just a placeholder, would later be replaced with an actual auth controller
    const {webhookId, token} = req.params;
    console.log(req.params)
    if(!webhookId || !token){
        res.status(401).send(req.params);
    }
    else next();
};

router.get('/root', webhookController.rootURI);


router.get('/:webhookId/:token', authenticate, (req,res)=>{
    //https://discord.com/api/webhooks/1329203449035886652/eA8N4__rYZ8u9ba594_Z81mj3tK_ooL6u4WVVYTrcx5y7JJr1o-5te4sGZKHyQ32wuoK
    res.send(`/api/webhooks/${req.params.webhookId}/${req.params.token}`);
});

module.exports = router;