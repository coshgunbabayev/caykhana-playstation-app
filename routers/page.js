import { Router } from 'express';
const router = new Router();

import {
    getIndex
} from '../controllers/page.js';

router.route('/')
    .get(getIndex);

export default router;