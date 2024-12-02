import {
    getAllProductsOneTypeDB,
    getProductDB,
    createAloneProductDB,
    createSetProductDB,
    updateProductDB
} from '../database/modules/products.js';

import {
    createExpenseDB
} from '../database/modules/admin/expense.js'

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
    let { quantity, purchase } = req.body;
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

    purchase = purchase / quantity;

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

async function reduceProduct(req, res) {
    const { id } = req.params;
    let { quantity, refund } = req.body;
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

    if (!refund) {
        err.refund = 'refundIsRequired';
    } else if (isNaN(Number(refund))) {
        err.refund = 'refundIsNotNumber';
    } else if (Number(refund) < 0) {
        err.refund = 'refundIsNotPositive';
    };

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    const product = await getProductDB('id', Number(id));

    if (product.type !== 'warehouse') {
        return res.status(400).json({});
    };

    quantity = Number(quantity);
    refund = Number(refund);

    const originalTotalPurchase = product.quantity * product.purchase;
    const newTotalPurchase = originalTotalPurchase - refund;
    const newQuantity = product.quantity - quantity;
    let newPurchase;

    if (newQuantity === 0) {
        newPurchase = 0;

        if (newTotalPurchase > 0) {
            await createExpenseDB(product.name, newTotalPurchase);
        }
    } else {
        newPurchase = newTotalPurchase / newQuantity;
    };

    await updateProductDB(
        Number(id),
        ['quantity', 'purchase'],
        [newQuantity, Number(Number(newPurchase).toFixed(2))]
    );

    res.status(200).json({});
};

export {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    increaseProduct,
    reduceProduct
};