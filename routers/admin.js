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
    deleteWarehouse,
    getWithoutWarehouse,
    createWithoutWarehouse,
    deleteWithoutWarehouse
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

router.route('/warehouse/:id')
    .delete(authenticateForApi, deleteWarehouse);

router.route('/without-warehouse')
    .get(authenticateForApi, getWithoutWarehouse)
    .post(authenticateForApi, createWithoutWarehouse);

router.route('/without-warehouse/:id')
    .delete(authenticateForApi, deleteWithoutWarehouse);

export default router;