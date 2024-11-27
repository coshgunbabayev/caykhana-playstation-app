import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getOneTable,
    getOrder,
    createOrder,
    createTime
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .get(getOneTable)

router.route('/:id/order')
    .get(getOrder)
    .post(createOrder);

router.route('/:id/time')
    // .get(getTime)
    .post(createTime);

export default router;