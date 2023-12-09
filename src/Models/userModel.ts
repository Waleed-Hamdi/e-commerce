import mongoose from "mongoose";
import bcrypt from 'bcrypt';


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,

    },
    lastname:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false
    },

    cart:{
        type: Array,
        default:[]
    },

    address: [{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],

    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],

    refreshToken: {
        type: String,

    }
    
    
},{
    timestamps: true,
}
);


userSchema.pre("save", async function(_next){
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.isPasswordMatched = async function(enterd: string){
    console.log(this.password);
    console.log(this);
    console.log(enterd);
    return await bcrypt.compare(enterd,this.password);
}

//Export the model
export default mongoose.model('Users',userSchema);
// module.exports = mongoose.model('User', userSchema);