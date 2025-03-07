import passport from 'passport';
import {Strategy} from 'passport-discord'
import {User} from '../models/user'


const scopes = ['identify', 'email', 'guilds'];

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENT_ID as string ,
    clientSecret: process.env.DISCORD_OAUTH_SECRET as string ,
    callbackURL:  process.env.DISCORD_OAUTH_CALLBACK_URL ,
    scope: scopes },
    async function(accessToken, refreshToken,profile, cb){
        const user =  await User.findOrCreate({where:{discord_UID:profile.id},
            defaults:{
                discord_UID : profile.id,
                username : profile.username,
                email: profile.email || "N/A",
                locale : profile.locale,
                accessToken : accessToken,
                verified: profile.verified
            }
        });
        return cb(null, user)

    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;