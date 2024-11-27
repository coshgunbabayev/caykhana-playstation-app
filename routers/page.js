import { Router } from 'express';
const router = new Router();

import {
    getIndex,
    getAdminLogin,
    getAdmin,
    getTable,
    getWarehouse,
    getWithoutWarehouse,
    getSet,
    getExpense
} from '../controllers/page.js';

import {
    authenticateForPage
} from '../middlewares/adminAuth.js'

router.route('/')
    .get(getIndex);

router.route('/login')
    .get(getAdminLogin);

router.route('/admin')
    .get(authenticateForPage, getAdmin);

router.route('/admin/table')
    .get(authenticateForPage, getTable);

router.route('/admin/warehouse')
    .get(authenticateForPage, getWarehouse);

router.route('/admin/without-warehouse')
    .get(authenticateForPage, getWithoutWarehouse);

router.route('/admin/set')
    .get(authenticateForPage, getSet);

router.route('/admin/expense')
    .get(authenticateForPage, getExpense);

export default router;