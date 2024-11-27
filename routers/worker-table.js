import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getOneTable,
    getOrder
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .get(getOneTable)

router.route('/:id/order')
    .get(getOrder);

export default router;