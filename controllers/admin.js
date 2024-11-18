import jwt from 'jsonwebtoken';

import {
    getAllTablesDB,
    createTableDB,
    deleteTableDB
} from '../database/modules/table.js'

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

async function getTables(req, res) {
    const tables = await getAllTablesDB();

    res.status(200).json({
        tables
    });
};

async function createTable(req, res) {
    const { name } = req.body;
    await createTableDB(name, 0);
    res.status(200).json({});
};

async function deleteTable(req, res) {
    const { id } = req.params;
    await deleteTableDB(id);
    res.status(200).json({});
};

export {
    login,
    logout,
    getTables,
    createTable,
    deleteTable
};