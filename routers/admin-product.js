import { Router } from 'express';
const router = new Router();

import {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    increaseProduct,
    reduceProduct
} from '../controllers/admin-product.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/')
    .post(authenticateForApi, createProduct)

router.route('/:type')
    .get(authenticateForApi, getProduct);

router.route('/:id')
    .put(authenticateForApi, updateProduct)
    .delete(authenticateForApi, deleteProduct);

router.route('/increase/:id')
    .put(authenticateForApi, increaseProduct);

router.route('/reduce/:id')
    .put(authenticateForApi, reduceProduct);

export default router;