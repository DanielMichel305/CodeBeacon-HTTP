import passport from 'passport';
import {Strategy as DiscordStrategy} from 'passport-discord'
import { Strategy as  JwtStrategy, ExtractJwt } from 'passport-jwt';
import {User} from '../api/models/user'
import jwt from 'jsonwebtoken';
import session from 'express-session';

const scopes = ['identify', 'email', 'guilds'];

export type DiscordUser = {
    discord_UID : string,
    username : string,
     email : string ,
     accessToken : string,
     refreshToken : string,
     locale : string,
     verified : boolean,

}


passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID as string ,
    clientSecret: process.env.DISCORD_OAUTH_SECRET as string ,
    callbackURL:  process.env.DISCORD_OAUTH_CALLBACK_URL ,
    scope: scopes },
    async function(accessToken, refreshToken,profile, cb){          //use a try catch block
        const [user , _] =  await User.findOrCreate({where:{discord_UID:profile.id},
            defaults:{
                discord_UID : profile.id,
                username : profile.username,
                email: profile.email || "N/A",
                verified: profile.verified
            }
        }); ////Try catch 
        const AuthUser = {
            ...user!.get(),
            accessToken,
            refreshToken
        }
        return cb(null, AuthUser)

    }
));


const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET as string
}

passport.use(new JwtStrategy(jwtOptions, async(jwtPayload, done)=>{

    try{
        const user = await User.findOne({where :{discord_UID: jwtPayload.discord_UID}})         ////define a jwtPayload typee!!!
        if(user) return done(null, user)
        return done(null, false);

    } catch (err){
        return done(err, false)
    }

}))


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;