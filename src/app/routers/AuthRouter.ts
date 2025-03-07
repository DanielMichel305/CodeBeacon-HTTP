import { Router, Response,Request, NextFunction } from "express";
import passport from "passport";


const authRouter : Router = Router();

authRouter.get('/discord', passport.authenticate('discord'))
authRouter.get('/discord/callback', passport.authenticate('discord', {failureRedirect : '/'}), 
    (req: Request, res: Response)=>{
        res.redirect('/');
    }
)

export default authRouter;
