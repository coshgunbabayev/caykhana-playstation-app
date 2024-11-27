import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getOneTable,
    getOrder,
    createOrder
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .get(getOneTable)

router.route('/:id/order')
    .get(getOrder)
    .post(createOrder);

export default router;