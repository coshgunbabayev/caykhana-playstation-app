import {
    getAllTableDB,
    getTableDB,
} from '../database/modules/worker/table.js';

async function getTable(req, res) {
    const tables = await getAllTableDB();
    res.status(200).json({
        tables
    });
};

export {
    getTable
};