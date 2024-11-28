import {
    getProductDB,
    createSetProductDB,
    updateProductDB
} from '../database/modules/products.js';

async function createSet(req, res) {
    const { name, sale } = req.body;
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

    if (Object.keys(err).length > 0) {
        return res.status(400).json(err);
    };

    await createSetProductDB('set', name, '', Number(sale));
    res.status(200).json({});
};

async function updateSet(req, res) {
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

async function deleteSet(req, res) {
    const { id } = req.params;

    await updateProductDB(
        Number(id),
        ['active'],
        ['false']
    );
    res.status(200).json({});
};

export {
    createSet,
    updateSet,
    deleteSet
};