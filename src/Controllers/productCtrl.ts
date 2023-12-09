import asyncHandler from 'express-async-handler';
import Product from '../Models/productModel'
import slugify from 'slugify';
import { log } from 'console';

const createProduct = asyncHandler( async (req, res) => {

    try {

        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }

        const newProduct = await Product.create(req.body);
        res.json({newProduct})
    } catch (err) {
        //@ts-ignore
        throw new Error(err);
        
    }

    
});

//Update a Product 

const updateProduct = asyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        
        const updateprodust = await Product.findByIdAndUpdate(id,req.body,{new: true});
        res.json(updateprodust);

    } catch (err) {
        //@ts-ignore
        throw new Error(err)
    }
});


// delete product

const deleteProduct = asyncHandler( async (req, res) => {
    const {id} = req.params;
    try {
        const deleteprodust = await Product.findByIdAndDelete(id);
        res.json(deleteprodust);

    } catch (err) {
        //@ts-ignore
        throw new Error(err)
    }
});

// get product

const getProduct = asyncHandler( async (req, res) => {
    const {id} = req.params;

    try {
        
        const product = await Product.findById(id);
        res.json(product);
    } catch (error) {
        //@ts-ignore
        throw new Error(error);
    }
})

// get all product 

const getAllproducts = asyncHandler(async (req, res) => {

    try {
        

        const queryObj = {...req.query};

        const excludeFields  = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach(ex => delete queryObj[ex]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        const query = Product.find(JSON.parse(queryStr));
        const product = await query;

     
        res.json(product);
    } catch (err) {
        //@ts-ignore
        throw new Error (err);
        
    }
});


export {createProduct, getProduct,getAllproducts,updateProduct, deleteProduct};