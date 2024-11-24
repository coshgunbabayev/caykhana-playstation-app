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
    createAloneProductDB,
    createSetProductDB,
    updateProductDB
} from '../database/modules/products.js';

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

async function createProduct(req, res) {
    const { name, sale, category, type } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else if (await getProductDB('name', name)) {
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

    await createAloneProductDB(type, name, category, Number(sale));
    res.status(200).json({});
};

async function getProduct(req, res) {
    const products = await getAllProductsOneTypeDB(req.params.type);
    res.status(200).json({
        products
    });
};

async function updateProduct(req, res) {
    const { id } = req.params;
    const { name, sale } = req.body;
    const err = new Object();

    if (!name) {
        err.name = 'nameIsRequired';
    } else {
        const product = await getProductDB('name', name);
        if (product && product.id != id) {
            err.name = 'nameIsUsed';
        };
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

    await updateProductDB(
        Number(id),
        ['name', 'sale'],
        [name, Number(Number(sale).toFixed(2))]
    );

    res.status(200).json({});
};

async function deleteProduct(req, res) {
    const { id } = req.params;

    const product = await getProductDB('id', id);

    if (product.type === 'warehouse' && product.quantity > 0) {
        return res.status(400).json({});
    };

    await updateProductDB(
        Number(id),
        ['active'],
        ['false']
    );
    res.status(200).json({});
};

async function increaseProduct(req, res) {
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

    const product = await getProductDB('id', Number(id));

    if (product.type !== 'warehouse') {
        return res.status(400).json({});
    };

    const originalTotalPurchase = product.quantity * product.purchase;
    const addTotalPurchase = Number(quantity) * Number(purchase);
    const newTotalPurchase = originalTotalPurchase + addTotalPurchase;
    const newQuantity = product.quantity + Number(quantity);
    const newPurchase = newTotalPurchase / newQuantity;

    await updateProductDB(
        Number(id),
        ['quantity', 'purchase'],
        [newQuantity, Number(Number(newPurchase).toFixed(2))]
    );

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
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    increaseProduct,
    getExpense,
    createExpense,
    deleteExpense
};