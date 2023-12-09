import mongoose from "mongoose";

//@ts-ignore
const validatemongoid = (id) => { 
    
    const valid =  mongoose.Types.ObjectId.isValid(id);

    if(!valid){
        throw new Error('this id is invalid or not exist')
    }
}

export default validatemongoid;