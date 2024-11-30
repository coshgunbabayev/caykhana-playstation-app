import { Router } from 'express';
const router = new Router();

import {
    login,
    logout,
    getAllIncomeAndExpense
} from '../controllers/admin.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/login')
    .post(login);

router.route('/logout')
    .delete(authenticateForApi, logout);

router.route('/all-income-expense')
    .get(authenticateForApi, getAllIncomeAndExpense);

export default router;