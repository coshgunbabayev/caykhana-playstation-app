import moment from 'moment';
import db from '../main.js';

let sqlcommand;

async function getAllIncomeDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM income';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createIncomeDB(tableName, price, profit) {
    const now = moment();
    sqlcommand = `INSERT INTO income (tableName, price, profit, day, month, year, date) VALUES ('${tableName}', ${price}, ${profit}, ${now.date()}, ${now.month() + 1}, ${now.year()}, '${(new Date).toISOString()}')`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

export {
    getAllIncomeDB,
    createIncomeDB
};