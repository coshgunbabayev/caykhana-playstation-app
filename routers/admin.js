import { Router } from 'express';
const router = new Router();

import {
    login,
    logout,
    getProduct,
    updateProduct,
    deleteProduct,
    increaseProduct,
    getExpense,
    createExpense,
    deleteExpense
} from '../controllers/admin.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/login')
    .post(login);

router.route('/logout')
    .delete(authenticateForApi, logout);

router.route('/product/:type')
    .get(authenticateForApi, getProduct);

router.route('/product/:id')
    .put(authenticateForApi, updateProduct)
    .delete(authenticateForApi, deleteProduct);

router.route('/product/increase/:id')
    .put(authenticateForApi, increaseProduct);

router.route('/expense')
    .get(authenticateForApi, getExpense)
    .post(authenticateForApi, createExpense);

router.route('/expense/:id')
    .delete(authenticateForApi, deleteExpense);

export default router;