import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.MONGODB_URL as string

const dbConnect = () => {
   try {
      mongoose.connect(db).then(()=>{
         console.log('successfuly connected');
      })
   } catch (err) {
      console.log(err);
   }
}

export default dbConnect;