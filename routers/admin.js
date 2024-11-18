import { Router } from 'express';
const router = new Router();

import {
    login,
    logout,
    getTables,
    createTable,
    deleteTable
} from '../controllers/admin.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/login')
    .post(login);

router.route('/logout')
    .delete(authenticateForApi, logout);

router.route('/table')
    .get(authenticateForApi, getTables)
    .post(authenticateForApi, createTable);

router.route('/table/:id')
    .delete(authenticateForApi, deleteTable);

export default router;