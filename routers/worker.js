import { Router } from 'express';
const router = new Router();

import {
    getTable,
} from '../controllers/worker.js';

router.route('/table')
    .get(getTable)

export default router;