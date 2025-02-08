import express, {Router, Request, Response,NextFunction} from 'express'
import {Passport} from 'passport';
import {Strategy} from 'passport-discord';

const authRouter: Router = express.Router();
const passport = new Passport();
const discordStrategy = Strategy;

passport.use(new discordStrategy({
    clientID:process.env.DISCORD_CLIENT_ID!,
    clientSecret:'',
    callbackURL: "http://localhost:8080/d",
    scope: ['identify','email','guilds', 'guilds.join']

},
(accessToken: any, refreshToken: any,profle: any,cb: any)=>{

}))



authRouter.get('/discord',passport.authenticate('discord'));
authRouter.get('/discord/callback', passport.authenticate('discord', {failureRedirect: '/'}), (req: Request, res: Response)=>{res.redirect('/d')})


export default authRouter;
