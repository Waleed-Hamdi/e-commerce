import users from "../Models/userModel";
import  jwt from 'jsonwebtoken';
import  asynchandler from 'express-async-handler';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = asynchandler( async (req, res, next)=> {
           try {
            
            let token;
            if(req.headers.authorization?.startsWith('Bearer')){

                token = req.headers.authorization.split(' ')[1];
                try {
                    if(token){
                        //@ts-ignore
                        const decoded = jwt.verify(token,process.env.JWT_SECRET);
                        const user = await users.findById(decoded.id);
                        //@ts-ignore
                        req.user = user;

                        next();
                    }
                } catch (error) {
                    res.json({
                        message: 'not authenticated please login again'
                    })
                }

            }else{
                res.json({
                message: 'there is no token attached'
                })
            }

           } catch (error) {
            //@ts-ignore
            throw new Error(error)
           }
})

const isAdmin = asynchandler( async (req, res, next) => {

    //@ts-ignore
    if(req.user.role == 'admin'){
        next();
    }else{
       res.json({
        message: 'sorry you are not admin'
       })
    }

});


export {authMiddleware, isAdmin};