import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/worker/table.js';

import {
    getAllOrderDB,
    getOrderDB,
    getMoreThanOneOrderDB
} from '../database/modules/worker/order.js';

import {
    getAllTimeDB,
    getTimeDB
} from '../database/modules/worker/time.js';

async function getTable(req, res) {
    const tables = await getAllTableDB();
    res.status(200).json({
        tables
    });
};

async function getTableById(req, res) {
    const { id } = req.params
    const table = await getTableDB('id', Number(id));
    res.status(200).json({
        table
    });
};

async function getTableIsActive(req, res) {
    const { id } = req.params;
    const table = getTableDB('id', Number(id));
    const orders = await getMoreThanOneOrderDB('tableId', Number(id));
    const time = await getTimeDB('tableId', Number(id))

    res.status(200).json({
        isActive: Boolean(orders.length > 0) || time
    });
};

export {
    getTable,
    getTableById,
    getTableIsActive,
};