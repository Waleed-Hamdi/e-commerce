import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const generateToken = (id: string) => {
    //@ts-ignore
    return jwt.sign({id},secret,{expiresIn:"1d"});
} 


export default generateToken;