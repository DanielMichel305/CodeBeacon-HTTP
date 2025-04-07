import express ,{ Router, Request,Response,NextFunction } from "express";


const dashboardRouter : Router =  express.Router();


dashboardRouter.get('/',(req: Request, res: Response)=>{

    res.send("HELLOOO DASHBOARD");

})


export default dashboardRouter