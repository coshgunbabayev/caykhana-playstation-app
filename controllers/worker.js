import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/worker/table.js';

import {
    getAllOrderDB,
    getOrderDB,
    getMoreThanOneOrderDB
} from '../database/modules/worker/order.js';

async function getTable(req, res) {
    const tables = await getAllTableDB();
    res.status(200).json({
        tables
    });
};

async function getTableIsActive(req, res) {
    const { id } = req.params;
    const orders = await getMoreThanOneOrderDB('tableId', Number(id));
    res.status(200).json({
        isActive: Boolean(orders.length > 0)
    });
};

export {
    getTable,
    getTableIsActive,
};