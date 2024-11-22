import { Router } from 'express';
const router = new Router();

import {
    getTable,
    getTableById,
    getTableIsActive,
} from '../controllers/worker.js';

router.route('/table')
    .get(getTable);

router.route('/table/:id')
    .get(getTableById)

router.route('/table/:id/is-active')
    .get(getTableIsActive);

export default router;