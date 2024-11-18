import { Router } from 'express';
const router = new Router();

import {
    login,
    logout
} from '../controllers/admin.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/login')
    .post(login);

router.route('/logout')
    .delete(authenticateForApi, logout)

export default router;