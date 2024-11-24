import {
    getAllTableDB,
    getTableDB,
    createTableDB,
    deleteTableDB,
} from '../database/modules/table.js';

async function getTable(req, res) {
    const tables = await getAllTableDB();
    res.status(200).json({
        tables
    });
};

async function createTable(req, res) {
    const { name, role } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    };

    if (!role) {
        err.role = 'roleIsRequired';
    };

    if (await getTableDB('name', name)) {
        return res.status(400).json({
            name: 'nameIsUsed'
        });
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createTableDB(name, role);
    res.status(200).json({});
};

async function deleteTable(req, res) {
    const { id } = req.params;
    await deleteTableDB(id);
    res.status(200).json({});
};

export {
    getTable,
    createTable,
    deleteTable,
};