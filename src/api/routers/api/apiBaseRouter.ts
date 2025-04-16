// export const router = require('express').Router();
// const webhookRouter = require('./webhookRouter')
import express, {Router} from 'express';
import webhookRouter from "./webhookRouter";
import dashboardApiRouter from './dashboardRouter';
import {mentionRoleRouter} from './discord_integration/metnionrolesRouter'
import { discordIntegrationRouter } from './discord_integration/discordintegrationRouter';

const apiBaseRouter: Router = express.Router()
    .use('/webhooks', webhookRouter)
    .use('/dashboard', dashboardApiRouter)
    .use('/discord-integration', discordIntegrationRouter)
    .use('/discord-integration/mention-roles', mentionRoleRouter);

export default apiBaseRouter;