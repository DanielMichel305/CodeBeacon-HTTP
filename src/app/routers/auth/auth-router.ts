import express, {Router, Request, Response,NextFunction} from 'express'

const authRouter: Router = express.Router();


authRouter.get('/login', (req: Request, res: Response)=>{

    res.send('LOGIN');

});


export default authRouter;
