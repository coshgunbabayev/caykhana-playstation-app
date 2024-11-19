import jwt from 'jsonwebtoken';

import {
    getAllTableDB,
    getTableDB,
    createTableDB,
    deleteTableDB,
} from '../database/modules/table.js'

import {
    getAllWarehouseDB,
    getWarehouseDB,
    createWarehouseDB,
    updateWarehouseDB,
    deleteWarehouseDB
} from '../database/modules/warehouse.js'

import {
    getAllWithoutWarehouseDB,
    getWithoutWarehouseDB,
    createWithoutWarehouseDB,
    updateWithoutWarehouseDB,
    deleteWithoutWarehouseDB
} from '../database/modules/without-warehouse.js'

function login(req, res) {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                password: 'passwordIsRequired'
            });
        };

        if (password !== process.env.PASSWORD) {
            return res.status(400).json({
                password: 'passwordIsIncorrect'
            });
        };

        const token = jwt.sign({ id: process.env.ID }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        res.cookie('token', token);
        res.status(200).json({});

    } catch (err) {
        res.status(500).json({
            message: 'error'
        });
    };
};

function logout(req, res) {
    try {
        res.clearCookie('token');

        res.status(200).json({});
    } catch (err) {
        res.status(400).json({
            message: err
        });
    };
};

async function getTable(req, res) {
    const tables = await getAllTableDB();
    res.status(200).json({
        tables
    });
};

async function createTable(req, res) {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            name: 'nameIsRequired'
        });
    };

    if (await getTableDB('name', name)) {
        return res.status(400).json({
            name: 'nameIsUsed'
        });
    };

    await createTableDB(name, 0);
    res.status(200).json({});
};

async function deleteTable(req, res) {
    const { id } = req.params;
    await deleteTableDB(id);
    res.status(200).json({});
};

async function getWarehouse(req, res) {
    const products = await getAllWarehouseDB();
    res.status(200).json({
        products
    });
};

async function createWarehouse(req, res) {
    const { name, sale } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if (await getWarehouseDB('name', name)) {
        err.name = 'nameIsUsed';
    };

    if (!sale) {
        err.sale = 'saleIsRequired';
    } else if (isNaN(Number(sale))) {
        err.sale = 'saleIsNotNumber';
    } else if (Number(sale) <= 0) {
        err.sale = 'saleIsNotPositive';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createWarehouseDB(name, Number(sale));
    res.status(200).json({});
};

async function updateWarehouse(req, res) {
    const { id } = req.params;
    const { name, sale } = req.body;
    await updateWarehouseDB(Number(id), name, Number(sale));
    res.status(200).json({});
};

async function deleteWarehouse(req, res) {
    const { id } = req.params;
    await deleteWarehouseDB(id);
    res.status(200).json({});
};

async function getWithoutWarehouse(req, res) {
    const products = await getAllWithoutWarehouseDB();
    res.status(200).json({
        products
    });
};

async function createWithoutWarehouse(req, res) {
    const { name, sale } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if (await getWithoutWarehouseDB('name', name)) {
        err.name = 'nameIsUsed';
    };

    if (!sale) {
        err.sale = 'saleIsRequired';
    } else if (isNaN(Number(sale))) {
        err.sale = 'saleIsNotNumber';
    } else if (Number(sale) <= 0) {
        err.sale = 'saleIsNotPositive';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createWithoutWarehouseDB(name, Number(sale));
    res.status(200).json({});
};

async function updateWithoutWarehouse(req, res) {
    const { id } = req.params;
    const { name, sale } = req.body;
    await updateWithoutWarehouseDB(Number(id), name, Number(sale));
    res.status(200).json({});
};

async function deleteWithoutWarehouse(req, res) {
    const { id } = req.params;
    await deleteWithoutWarehouseDB(id);
    res.status(200).json({});
};

export {
    login,
    logout,
    getTable,
    createTable,
    deleteTable,
    getWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWithoutWarehouse,
    createWithoutWarehouse,
    updateWithoutWarehouse,
    deleteWithoutWarehouse
};