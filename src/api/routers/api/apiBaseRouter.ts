// export const router = require('express').Router();
// const webhookRouter = require('./webhookRouter')
import express, {Router} from 'express';
import webhookRouter from "./webhookRouter";
import dashboardApiRouter from './dashboardRouter';

const apiBaseRouter: Router = express.Router();

apiBaseRouter.use('/webhooks', webhookRouter)
apiBaseRouter.use('/dashboard', dashboardApiRouter)

export default apiBaseRouter;