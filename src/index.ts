import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import dbConnect from './Config/dbConnect';
import authrouter from './Routes/authRoute';
import { errorHandler, notFound } from './Middlewares/errorHandler';
import cookieParser from 'cookie-parser';
import productRouter from './Routes/productRoute';
import morgan from 'morgan';

dotenv.config();
dbConnect()

const app = express();
const port  = process.env.PORT || 5000

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(cookieParser());




app.use('/api/user',authrouter);
app.use('/api/product',productRouter)


app.use(notFound);
app.use(errorHandler);

app.listen(port,()=>{
    console.log('this server is running on port 4000');
})
