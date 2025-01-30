// export const router = require('express').Router();
// const webhookRouter = require('./webhookRouter')
import express, {Router} from 'express';
import webhookRouter from "./webhookRouter";

const apiBaseRouter: Router = express.Router();

apiBaseRouter.use('/webhooks', webhookRouter)

export default apiBaseRouter;