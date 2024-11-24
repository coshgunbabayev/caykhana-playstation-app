import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getOneTable,
    getTableIsActive,
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .get(getOneTable)

router.route('/:id/is-active')
    .get(getTableIsActive);

// router.route('/product')
//     .get(getProduct);

export default router;