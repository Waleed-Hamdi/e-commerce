import express from 'express';
import { createProduct, deleteProduct, getAllproducts, getProduct, updateProduct } from '../Controllers/productCtrl';
import { isAdmin, authMiddleware } from '../Middlewares/authMiddleware';

const productRouter = express.Router();

productRouter.post('/',authMiddleware,isAdmin,createProduct);
productRouter.get('/:id',getProduct);
productRouter.get('/',getAllproducts);
productRouter.put('/:id',authMiddleware,isAdmin,updateProduct);
productRouter.delete('/:id',authMiddleware,isAdmin,deleteProduct);

export default productRouter;