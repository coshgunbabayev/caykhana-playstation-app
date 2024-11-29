import { Router } from 'express';
const router = new Router();

import {
    getTable,
    closeTable,
    getOrder,
    createOrder,
    deleteOneOrder,
    deleteOrder,
    getTime,
    createTime,
    deleteTime
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .delete(closeTable);

router.route('/:id/order')
    .get(getOrder)
    .post(createOrder);

router.route('/order/:id')
    .put(deleteOneOrder)
    .delete(deleteOrder);

router.route('/:id/time')
    .get(getTime)
    .post(createTime)
    .delete(deleteTime);

export default router;