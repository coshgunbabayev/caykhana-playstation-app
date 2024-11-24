import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/table.js';

import {
    getAllOrderDB,
    getOneOrderDB,
    getOrderDB
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

async function getOneTable(req, res) {
    const { id } = req.params
    const table = await getTableDB('id', Number(id));
    // const orders ='' //////////
        res.status(200).json({
            table,
            orders
        });
};

export {
    getTable,
    getOneTable
};