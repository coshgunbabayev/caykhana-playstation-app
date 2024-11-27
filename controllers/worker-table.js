import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/table.js';

import {
    getAllOrderDB,
    getOrderOneTableDB,
    getOrderDB,
    createOrderDB,
    updateOrderDB
} from '../database/modules/worker/order.js';

import {
    getAllTimeDB,
    getTimeOneTableDB
} from '../database/modules/worker/time.js';

async function getTable(req, res) {
    const tables = await getAllTableDB();

    for (let i = 0; i < tables.length; i++) {
        tables[i].isHaveOrder = (await getOrderOneTableDB(tables[i].id)).length > 0;

        if (tables[i].role === 'playstation') {
            tables[i].isHaveTime = Boolean(await getTimeOneTableDB(tables[i].id) &&
                Object.keys(await getTimeOneTableDB(tables[i].id)).length > 0);
        };
    };

    res.status(200).json({
        tables
    });
};

async function getOneTable(req, res) {
};

async function getOrder(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({});
    }

    const orders = await getOrderOneTableDB(Number(id));
    res.status(200).json({
        orders
    });
};

async function createOrder(req, res) {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    const err = new Object();

    if (!productId) {
        err.product = 'productIsRequired';
    };

    if (!quantity) {
        err.quantity = 'quantityIsRequired';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    const orders = await getOrderOneTableDB(Number(id));
    const thisOrder = orders.find(order => order.productId == productId);
    
    if (thisOrder === undefined) {
        await createOrderDB(Number(id), Number(productId), Number(quantity));
    } else {
        await updateOrderDB(thisOrder.id, 'quantity', thisOrder.quantity + Number(quantity));
    };

    res.status(200).json({});
};

export {
    getTable,
    getOneTable,
    getOrder,
    createOrder
};