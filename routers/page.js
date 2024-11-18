import { Router } from 'express';
const router = new Router();

import {
    getIndex,
    getAdminLogin,
    getAdmin,
    getTables,
    getWarehouse,
    getWithoutWarehouse
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

router.route('/admin/tables')
    .get(authenticateForPage, getTables);

router.route('/admin/warehouse')
    .get(authenticateForPage, getWarehouse);

router.route('/admin/without-warehouse')
    .get(authenticateForPage, getWithoutWarehouse);

export default router;