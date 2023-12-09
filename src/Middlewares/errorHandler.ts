// not found
import express, { Request,Response } from "express"; 


const notFound = (req: Request, res: Response, next: express.Errback) => {
    
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    console.log(error);
    next(error);

}


// Error  Handler

const errorHandler = (err: Error,req: Request, res: Response, next: express.Errback) => {
    
  console.log(err);
  console.log(res.statusCode);

    const statuscode = res.statusCode== 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack
    })
}

export  { errorHandler , notFound}