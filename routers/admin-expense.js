import { Router } from 'express';
const router = new Router();

import {
    getExpense,
    createExpense,
    deleteExpense
} from '../controllers/admin-expense.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/expense')
    .get(authenticateForApi, getExpense)
    .post(authenticateForApi, createExpense);

router.route('/expense/:id')
    .delete(authenticateForApi, deleteExpense);

export default router;