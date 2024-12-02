import jwt from 'jsonwebtoken';

import {
    getAllIncomeDB
} from '../database/modules/income.js';

import {
    getAllExpenseDB
} from '../database/modules/admin/expense.js';

function login(req, res) {
    try {
        const { password } = req.body;
        console.log(req.body);

        console.log(process.env.PASSWORD);

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

async function getAllIncomeAndExpense(req, res) {
    const incomes = await getAllIncomeDB();
    const expenses = await getAllExpenseDB();

    const updatedIncomes = incomes.map(obj => ({ ...obj, type: 'income' }));
    const updatedExpenses = expenses.map(obj => ({ ...obj, type: 'expense' }));

    let allData = [...updatedIncomes, ...updatedExpenses];
    allData.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({
        allData
    });
};

export {
    login,
    logout,
    getAllIncomeAndExpense
};