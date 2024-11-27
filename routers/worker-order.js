import { Router } from 'express';
const router = new Router();

import {
    createOrder
} from '../controllers/worker-order.js';

router.route('/')
    .post(createOrder);

export default router;