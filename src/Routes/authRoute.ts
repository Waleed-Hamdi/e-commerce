import express from 'express';
import {createUser,loginUser,getAllusers,getAuser, updateUser, deleteuser, blockUser, unblockUser, handlerfreshToken, logout} from '../Controllers/userCtrl';
import { authMiddleware, isAdmin } from '../Middlewares/authMiddleware';

const authRouter = express.Router();



authRouter.post('/register', createUser);
authRouter.post('/login', loginUser);

authRouter.get('/users',getAllusers);
authRouter.get('/refresh',handlerfreshToken);
authRouter.get('/logout',logout);
authRouter.get('/:id',authMiddleware,isAdmin,getAuser);

authRouter.put('/',authMiddleware,updateUser);
authRouter.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
authRouter.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);

authRouter.delete('/:id',deleteuser);


export default authRouter;