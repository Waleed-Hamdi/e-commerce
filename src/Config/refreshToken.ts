import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const generaterefreshToken = (id: string) => {
    //@ts-ignore
    return jwt.sign({id},secret,{expiresIn:"3d"});
} 


export default generaterefreshToken;