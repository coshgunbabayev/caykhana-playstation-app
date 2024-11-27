import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/table.js';

import {
    getAllOrderDB,
    getOrderOneTableDB,
    getOrderDB
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

export {
    getTable,
    getOneTable,
    getOrder
};