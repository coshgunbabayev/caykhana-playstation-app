import { Router } from 'express';
const router = new Router();

import {
    login,
    logout,
    getTable,
    createTable,
    deleteTable,
    getWarehouse,
    createWarehouse,
    increaseWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWithoutWarehouse,
    createWithoutWarehouse,
    updateWithoutWarehouse,
    deleteWithoutWarehouse,
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

router.route('/table')
    .get(authenticateForApi, getTable)
    .post(authenticateForApi, createTable);

router.route('/table/:id')
    .delete(authenticateForApi, deleteTable);

router.route('/warehouse')
    .get(authenticateForApi, getWarehouse)
    .post(authenticateForApi, createWarehouse);

router.route('/warehouse/increase/:id')
    .put(authenticateForApi, increaseWarehouse);

router.route('/warehouse/:id')
    .put(authenticateForApi, updateWarehouse)
    .delete(authenticateForApi, deleteWarehouse);

router.route('/without-warehouse')
    .get(authenticateForApi, getWithoutWarehouse)
    .post(authenticateForApi, createWithoutWarehouse);

router.route('/without-warehouse/:id')
    .put(authenticateForApi, updateWithoutWarehouse)
    .delete(authenticateForApi, deleteWithoutWarehouse);

router.route('/expense')
    .get(authenticateForApi, getExpense)
    .post(authenticateForApi, createExpense);

router.route('/expense/:id')
    .delete(authenticateForApi, deleteExpense);

export default router;