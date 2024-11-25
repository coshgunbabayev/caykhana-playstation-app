import {
    getAllProductsDB
} from '../database/modules/products.js';

async function getProduct(req, res) {
    const products = await getAllProductsDB();

    res.status(200).json({
        products
    });
};

export {
    getProduct
};