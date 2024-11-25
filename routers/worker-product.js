import { Router } from 'express';
const router = new Router();

import {
    getProduct
} from '../controllers/worker-product.js';

router.route('/')
    .get(getProduct);

export default router;