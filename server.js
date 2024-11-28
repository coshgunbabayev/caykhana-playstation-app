import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config()

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');

app.use(express.static('static'));

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});

import pageRouter from './routers/page.js';
import commonRouter from './routers/common.js';
import adminRouter from './routers/admin.js';
import adminTableRouter from './routers/admin-table.js';
import adminProductRouter from './routers/admin-product.js';
import adminSetRouter from './routers/admin-set.js';
import adminExpenseRouter from './routers/admin-expense.js';
import workerTableRouter from './routers/worker-table.js';
import workerProductRouter from './routers/worker-product.js';

app.use('/', pageRouter);
app.use('/api', commonRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/table', adminTableRouter);
app.use('/api/admin/product', adminProductRouter);
app.use('/api/admin/set', adminSetRouter);
app.use('/api/admin/expense', adminExpenseRouter);
app.use('/api/worker/table', workerTableRouter);
app.use('/api/worker/product', workerProductRouter);