import { Router, Response,Request, NextFunction } from "express";
import passport from "passport";
import { User } from "../models/user";
import jwt from 'jsonwebtoken'
import { DiscordUser } from "../../utils/passport-config";
import AuthController from "../controllers/authController";


const JWT_SECRET =  process.env.JWT_SECRET as string;

export function JWTAuthMiddleware(req:Request, res:Response ,next:NextFunction){
    const token = req.cookies.jwt;
    if(!token) {
          res.status(401).json({message : "Unauthorized, Try to login again"});
    }
    try {
        const decodedJwt = jwt.verify(token,  JWT_SECRET);
        req.user = decodedJwt;
        next();
    } catch (error) {
         res.status(401).json({message: "Token Expired or Invalid!"});
    }
}

const authRouter : Router = Router();

authRouter.get('/logout', AuthController.logout);

authRouter.get('/discord', passport.authenticate('discord'))
authRouter.get('/discord/callback', passport.authenticate('discord', {session: false, failureRedirect : '/'}), 
    (req: Request, res: Response)=>{

        if(!req.user){
            res.status(401).json({message : "Authentication failed!"}) ////redirect to sign in
        }

        const user = req.user as DiscordUser;

        req.session.user = {
            discord_UID : user.discord_UID,
            accessToken : user.accessToken,
            refreshToken : user.refreshToken
        } 

        const token = jwt.sign(
            {discord_UID : user.discord_UID, username :user.username},
            JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.cookie('jwt', token, {
            httpOnly:true,
            secure : false,                  ////////////////////////////////////////TIS NEEDS TO BE SECURE IN PROD
            sameSite: 'strict',
            maxAge :3600000
        })
        res.redirect('/');
    }
)

export default authRouter;
