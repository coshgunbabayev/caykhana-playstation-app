import { Router } from 'express';
const router = new Router();

import {
    getCategory
} from '../controllers/common.js';

router.route('/category')
    .get(getCategory);

export default router;