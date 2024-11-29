import {
    getAllProductsDB,
    getProductDB,
    updateProductDB
} from '../database/modules/products.js';

import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/table.js';

import {
    getAllOrderDB,
    getOrderOneTableDB,
    getOrderDB,
    createOrderDB,
    updateOrderDB,
    deleteOrderDB
} from '../database/modules/worker/order.js';

import {
    getAllTimeDB,
    getTimeOneTableDB,
    createTimeDB,
    updateTimeDB,
    deleteTimeDB
} from '../database/modules/worker/time.js';

import {
    getAllIncomeDB,
    createIncomeDB
} from '../database/modules/income.js'

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

async function closeTable(req, res) {
    const { id } = req.params;

    let orderSummaryPrice = 0;

    const table = await getTableDB('id', Number(id));
    const products = await getAllProductsDB();
    const orders = await getOrderOneTableDB(Number(id));

    for (const order of orders) {
        const product = products.find(product =>
            product.id == order.productId
        );
        orderSummaryPrice += product.sale * order.quantity;

        await deleteOrderDB(order.id);

        switch (product.type) {
            case 'warehouse':
                await updateProductDB(product.id, ['quantity', 'sold'], [product.quantity - order.quantity, product.sold + order.quantity]);
                break;

            case 'withoutWarehouse':
                await updateProductDB(product.id, ['sold'], [product.sold + order.quantity]);
                break;

            //// settttttttttttt


            //// hem de time olacaq
            default:
                break;
        };
    };

    if (table.role === 'playstation') {
        const time = await getTimeOneTableDB(Number(id));
        if (time !== undefined) {
            orderSummaryPrice += Number((1 * (new Date() - new Date(time.start)) / (1000 * 60 * 60)).toFixed(2));
            await deleteTimeDB(time.id);
        };
    };

    await createIncomeDB(table.name, orderSummaryPrice);

    res.status(200).json({});
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

    const product = await getProductDB('id', Number(productId));

    if (thisOrder === undefined) {
        await createOrderDB(Number(id), Number(productId), Number(quantity));

    } else {
        await updateOrderDB(thisOrder.id, 'quantity', thisOrder.quantity + Number(quantity));
    };

    if (product.type === 'set') {
        const structure = JSON.parse(product.structure);

        if (structure.time > 0) {
            const time = await getTimeOneTableDB(Number(id));

            if (time === undefined) {
                await createTimeDB(Number(id), 'limited', true, structure.time * Number(quantity));

            } else if (time.isSet === 'true') {
                await updateTimeDB(time.id, 'time', time.time + (structure.time * Number(quantity)));

            } else if (time.isSet === 'false') {
                await deleteTimeDB(time.id);
                await createTimeDB(Number(id), 'limited', true, structure.time * Number(quantity));
            };
        };
    };

    res.status(200).json({});
};

async function deleteOneOrder(req, res) {
    const { id } = req.params;
    const order = await getOrderDB('id', Number(id));
    await updateOrderDB(order.id, 'quantity', order.quantity - 1)
    res.status(200).json({});
};

async function deleteOrder(req, res) {
    const { id } = req.params;
    await deleteOrderDB(Number(id));
    res.status(200).json({});
};

async function getTime(req, res) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res.status(400).json({});
    };

    const time = await getTimeOneTableDB(Number(id));
    res.status(200).json({
        time
    });
};

async function createTime(req, res) {
    const { id } = req.params;
    const { time } = req.body;
    const err = new Object();

    if (!time) {
        err.time = 'timeIsRequired';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    if (time === 'unlimited') {
        await createTimeDB(Number(id), 'unlimited', false);
    } else {
        await createTimeDB(Number(id), 'limited', false, Number(time));
    };

    res.status(200).json({});
};

async function deleteTime(req, res) {
    const { id } = req.params;
    const time = await getTimeOneTableDB(Number(id));
    await deleteTimeDB(time.id);
    res.status(200).json({});
};

export {
    getTable,
    closeTable,
    getOrder,
    createOrder,
    deleteOneOrder,
    deleteOrder,
    getTime,
    createTime,
    deleteTime
};