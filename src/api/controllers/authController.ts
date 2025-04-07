import { Request,Response } from "express";
const GuildManageRole = 0x20  ///Bitfield value for roles that manage a server

type Guild = {
    id: string;           // Guild ID
    name: string;         // Guild name
    icon: string | null;  // Guild icon hash (nullable)
    owner?: boolean;      // Whether the user is the owner of the guild
    permissions: number;  // Bitwise permission flags
  };


export default class AuthController {

    
    public static logout(req: Request, res: Response){
        req.session.destroy(err=>{
            if(err){
                console.log(`[ERROR] Failed to destory session. ${err}`);
                res.status(500).send('Error: Couldn\'t logout');
            }
        })
        res.clearCookie('jwt', {path:'/'})
        res.redirect('/')
    }


    public static async getUserGuilds(accessToken: string){
        
        console.log(`[LOG] User AccessToken : ${accessToken}`);
        
        
        
        const response = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization : `Bearer ${accessToken}`
            }
        });
     

        console.log("[LOG] Status Code:", response.status);
        console.log("[LOG] X-RateLimit-Limit:", response.headers.get("X-RateLimit-Limit"));
        console.log("[LOG] X-RateLimit-Remaining:", response.headers.get("X-RateLimit-Remaining"));
        console.log("[LOG] X-RateLimit-Reset:", response.headers.get("X-RateLimit-Reset"));

        if(response.ok) {
            return await response.json();
        }

        
    }

    public static filterUserManagedGuilds(guildsList: Guild[]) : Guild[]{
        return guildsList.filter((guild)=>
            guild.owner || (guild.permissions & GuildManageRole) === GuildManageRole
        )
    }


    

}