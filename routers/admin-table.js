import { Router } from 'express';
const router = new Router();

import {
    getTable,
    createTable,
    deleteTable
} from '../controllers/admin-table.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/')
    .get(authenticateForApi, getTable)
    .post(authenticateForApi, createTable);

router.route('/:id')
    .delete(authenticateForApi, deleteTable);

export default router;