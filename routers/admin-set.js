import { Router } from 'express';
const router = new Router();

import {
    createSet
} from '../controllers/admin-set.js';

import {
    authenticateForApi
} from '../middlewares/adminAuth.js'

router.route('/')
    .post(authenticateForApi, createSet);

export default router;