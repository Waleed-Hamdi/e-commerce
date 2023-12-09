import Users from "../Models/userModel";
import {Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import generateToken from "../Config/jwt";
import validatemongoid from "../Utils/validateMongodbId";
import generaterefreshToken from "../Config/refreshToken";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const users = Users;

// Create user

const createUser  = asyncHandler(async (req: Request, res: Response)=> {

    const email = req.body.email;
    console.log(req.body);

    const findUser= await users.findOne({email : email});

    if(!findUser){

        const newUser = await users.create(req.body);
        res.json({
            newUser,
            token: generateToken(newUser.id)
        });

    }else{

       throw new Error ('USer Already exits');
    
    }

});

// Login user

const loginUser = asyncHandler(async (req,res)=>{

    const {email, password} = req.body;
    console.log(email,password);

    const findUser = await users.findOne({email: email});

    //@ts-ignore
    if(findUser && await findUser.isPasswordMatched(password)){

        const refreshToken = await generaterefreshToken(findUser.id);
        const updateUser = await users.findByIdAndUpdate(findUser.id,{
            refreshToken: refreshToken
        },{
            new: true

        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })

        res.json({
            _id : findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            token: generateToken(findUser.id)
        });

    }else{
        res.send('not exist');
    }

}); 

// handle refresh token

const handlerfreshToken = asyncHandler( async (req, res) => {

    //@ts-ignore
    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error('no refresh token in cookies');

    const refreshToken = cookie.refreshToken;

    console.log(refreshToken);
    const user = await users.findOne({refreshToken});
    if(!user) throw new Error('new refresh token present in db or not matched ')
    
    //@ts-ignore
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err, decoded) => {
        //@ts-ignore
        if(err || user.id !== decoded.id){
            throw new Error ('there is something wrong with refresh token');
        }

        const accessToken = generateToken(user.id);
        res.json({accessToken});
    })
    

})

// logout functionality
//@ts-ignore
const logout = asyncHandler( async (req, res) => {

    const cookie = req.cookies;
    if(!cookie.refreshToken) throw new Error('no refresh token in cookies');

    const refreshToken = cookie.refreshToken;
    const user = await users.findOne({refreshToken});

    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly: true,
            // secure: true
        });

        res.sendStatus(204);
    }

    await users.findOneAndUpdate({refreshToken},{
        refreshToken: ""
    },{
        new: true
    });

    res.clearCookie('refreshToken',{
        httpOnly: true,
        // secure: true
    });

    res.sendStatus(204);

});


// Get all users 

const getAllusers = asyncHandler(async (req, res) => {

    try {
        
        const allUsers = await users.find();
        res.json(allUsers);

    } catch (err) {
        //@ts-ignore
        throw new Error(err)
        
    }
});

// Get specific user

const getAuser = asyncHandler(async (req, res) => {

    try {

        const {id} = req.params;
        validatemongoid(id);
        const user = await users.findById(id);
        if(!user){
            res.json({
                message:"this user is not exist"
            })
        }
        res.json(user)

    } catch (err) {
        //@ts-ignore
        throw new Error('this user is not exist');
    }
});

// Update user

const updateUser = asyncHandler( async (req, res) => {

    try {
        //@ts-ignore
        const {id} = req.user;

        validatemongoid(id);

        const updated = await users.findByIdAndUpdate(id,{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile
        },
        {
            new: true
        });

        res.json(updated);

    } catch (err) {
        //@ts-ignore
        throw new Error(err);
        
    }
});

// Delete user 

const deleteuser = asyncHandler( async (req, res) => {

    try {

        const {id} = req.params;

        validatemongoid(id);
        const deleted =  await users.findByIdAndDelete(id);

        if(!deleted){
            res.status(404).json({
                message: 'this user is not exist'
            });
        }

         res.json({
            message: 'user deleted successfuly'
         })
        
    } catch (error) {
        //@ts-ignore
        throw new Error (error);
        
    }
});

//Block user
const blockUser = asyncHandler(async (req, res) => {

    const {id} = req.params;
    validatemongoid(id);
    try {
        const block  = await users.findByIdAndUpdate(id,{
            isBlocked: true
        },{
            new: true
        });

        res.json(block);
        
    } catch (error) {
        //@ts-ignore
        throw new Error(error)
    }

});

//UnBlock user
const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatemongoid(id);
    try {
        const unblock  = await users.findByIdAndUpdate(id,{
            isBlocked: false
        },{
            new: true
        });

        res.json(unblock);
        
    } catch (error) {
        //@ts-ignore
        throw new Error(error)
    }
    
}) 


export {
    createUser,
    loginUser,
    getAllusers,
    getAuser,
    updateUser,
    deleteuser,
    blockUser,
    unblockUser,
    handlerfreshToken,
    logout,
};