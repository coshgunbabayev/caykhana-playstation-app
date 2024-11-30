import moment from 'moment';

import db from '../../main.js';

let sqlcommand;

async function getAllExpenseDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM expense';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getExpenseDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM expense WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createExpenseDB(name, money) {
    const now = new Date();
    money = Number(money.toFixed(2));
    sqlcommand = `INSERT INTO expense (name, money, day, month, year, date) VALUES ('${name}', ${money}, ${now.getDate()}, ${now.getMonth() + 1}, ${now.getFullYear()}, '${now.toISOString()}')`;
    await db.run(sqlcommand, (err) => {
        if (err) {

            console.log(err);
            
            throw new Error('')
        };
    });
};

async function deleteExpenseDB(id) {
    sqlcommand = "DELETE FROM expense WHERE(id)=(?)";
    await db.run(sqlcommand, [id], (err) => {
        if (err) return console.error(err.message);
    });
};

export {
    getAllExpenseDB,
    getExpenseDB,
    createExpenseDB,
    deleteExpenseDB
};