import { Router } from 'express';
const router = new Router();

import {
    createSet,
    updateSet,
    deleteSet,
    updateProductOfSet,
    deleteProductFromSet,
    updateTimeOfSet,
    resetTimeOfSet
} from '../controllers/admin-set.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/')
    .post(authenticateForApi, createSet);

router.route('/:id')
    .put(authenticateForApi, updateSet)
    .delete(authenticateForApi, deleteSet);

router.route('/:id/product')
    .put(authenticateForApi, updateProductOfSet);

router.route('/:setId/product/:productId')
    .delete(authenticateForApi, deleteProductFromSet);

router.route('/:id/time')
    .put(authenticateForApi, updateTimeOfSet)
    .delete(authenticateForApi, resetTimeOfSet);

export default router;