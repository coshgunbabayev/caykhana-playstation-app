import { Router } from 'express';
const router = new Router();

import {
    createSet,
    updateSet,
    deleteSet
} from '../controllers/admin-set.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/')
    .post(authenticateForApi, createSet);

router.route('/:id')
    .put(authenticateForApi, updateSet)
    .delete(authenticateForApi, deleteSet);

export default router;