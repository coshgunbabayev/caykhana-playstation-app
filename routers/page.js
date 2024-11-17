import { Router } from 'express';
const router = new Router();

import {
    getIndex,
    getAdminLogin,
    getAdmin
} from '../controllers/page.js';

router.route('/')
    .get(getIndex);

router.route('/login')
    .get(getAdminLogin);

router.route('/admin')
    .get(getAdmin);

export default router;