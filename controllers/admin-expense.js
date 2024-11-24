import {
    getAllExpenseDB,
    getExpenseDB,
    createExpenseDB,
    deleteExpenseDB
} from '../database/modules/admin/expense.js'

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