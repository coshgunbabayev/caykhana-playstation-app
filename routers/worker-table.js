import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getOneTable
} from '../controllers/worker-table.js';

router.route('/')
    .get(getTable);

router.route('/:id')
    .get(getOneTable)

export default router;