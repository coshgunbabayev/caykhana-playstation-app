import jwt from 'jsonwebtoken';

import {
    getAllTableDB,
    getTableDB,
    createTableDB,
    deleteTableDB,
} from '../database/modules/admin/table.js';

import {
    getAllProductsOneTypeDB,
    getProductDB,
    createProductDB,
    updateProductDB,
    // automaticUpdateQuantityAndPurchaseofWarehouseDB,
    setDisabledProductDB
} from '../database/modules/admin/products.js';

import {
    getAllExpenseDB,
    getExpenseDB,
    createExpenseDB,
    deleteExpenseDB
} from '../database/modules/admin/expense.js'

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

async function getWarehouse(req, res) {
    const products = await getAllProductsOneTypeDB('warehouse');
    res.status(200).json({
        products
    });
};

async function createWarehouse(req, res) {
    const { name, sale, category } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if (await getWarehouseDB('name', name) || await getWithoutWarehouseDB('name', name)) {
        err.name = 'nameIsUsed';
    };

    if (!sale) {
        err.sale = 'saleIsRequired';
    } else if (isNaN(Number(sale))) {
        err.sale = 'saleIsNotNumber';
    } else if (Number(sale) <= 0) {
        err.sale = 'saleIsNotPositive';
    };

    if (!category) {
        err.category = 'categoryIsRequired';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createProductDB('warehouse', name, category, Number(sale));
    res.status(200).json({});
};

async function increaseWarehouse(req, res) {
    const { id } = req.params;
    const { quantity, purchase } = req.body;
    const err = new Object();

    if (!quantity) {
        err.quantity = 'quantityIsRequired';
    } else if (isNaN(Number(quantity))) {
        err.quantity = 'quantityIsNotNumber';
    } else if (!Number.isInteger(Number(quantity))) {
        err.quantity = 'quantityIsNotWholeNumber';
    } else if (Number(quantity) <= 0) {
        err.quantity = 'quantityIsNotPositive';
    };

    if (!purchase) {
        err.purchase = 'purchaseIsRequired';
    } else if (isNaN(Number(purchase))) {
        err.purchase = 'purchaseIsNotNumber';
    } else if (Number(purchase) <= 0) {
        err.purchase = 'purchaseIsNotPositive';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    const product = await getWarehouseDB('id', Number(id));

    const originalTotalPurchase = product.quantity * product.purchase;
    const addTotalPurchase = Number(quantity) * Number(purchase);
    const newTotalPurchase = originalTotalPurchase + addTotalPurchase;
    const newQuantity = product.quantity + Number(quantity);
    const newPurchase = newTotalPurchase / newQuantity;

    // await automaticUpdateQuantityAndPurchaseofWarehouseDB(Number(id), newQuantity, newPurchase);

    res.status(200).json({});
};

async function updateWarehouse(req, res) {
    const { id } = req.params;
    const { name, sale } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if ((await getWarehouseDB('name', name) && (await getWarehouseDB('name', name)).id != id) || await getWithoutWarehouseDB('name', name)) {
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

    await updateProductDB(Number(id), name, Number(sale));
    res.status(200).json({});
};

async function deleteWarehouse(req, res) {
    const { id } = req.params;

    if ((await getWarehouseDB('id', id)).quantity) {
        return res.status(400).json({});
    };

    await setDisabledProductDB(Number(id));
    res.status(200).json({});
};

async function getWithoutWarehouse(req, res) {
    const products = await getAllProductsOneTypeDB('withoutWarehouse');
    res.status(200).json({
        products
    });
};

async function createWithoutWarehouse(req, res) {
    const { name, sale, category } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if (await getWithoutWarehouseDB('name', name) || await getWarehouseDB('name', name)) {
        err.name = 'nameIsUsed';
    };

    if (!sale) {
        err.sale = 'saleIsRequired';
    } else if (isNaN(Number(sale))) {
        err.sale = 'saleIsNotNumber';
    } else if (Number(sale) <= 0) {
        err.sale = 'saleIsNotPositive';
    };

    if (!category) {
        err.category = 'categoryIsRequired';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createProductDB('withoutWarehouse', name, category, Number(sale));
    res.status(200).json({});
};

async function updateWithoutWarehouse(req, res) {
    const { id } = req.params;
    const { name, sale } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if ((await getWithoutWarehouseDB('name', name) && (await getWithoutWarehouseDB('name', name)).id != id) || await getWarehouseDB('name', name)) {
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

    await updateProductDB(Number(id), name, Number(sale));
    res.status(200).json({});
};

async function deleteWithoutWarehouse(req, res) {
    const { id } = req.params;
    await setDisabledProductDB(id);
    res.status(200).json({});
};

async function getExpense(req, res) {
    const expenses = await getAllExpenseDB();
    res.status(200).json({
        expenses
    });
};

async function createExpense(req, res) {
    const { name, money } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    };

    if (!money) {
        err.money = 'moneyIsRequired';
    } else if (isNaN(Number(money))) {
        err.money = 'moneyIsNotNumber';
    } else if (Number(money) <= 0) {
        err.money = 'moneyIsNotPositive';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createExpenseDB(name, Number(money));
    res.status(200).json({});
};

async function deleteExpense(req, res) {
    const { id } = req.params;
    await deleteExpenseDB(id);
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
    increaseWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWithoutWarehouse,
    createWithoutWarehouse,
    updateWithoutWarehouse,
    deleteWithoutWarehouse,
    getExpense,
    createExpense,
    deleteExpense
};