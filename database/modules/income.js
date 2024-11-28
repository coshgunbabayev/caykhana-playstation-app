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

async function createIncomeDB(tableName, price) {
    sqlcommand = `INSERT INTO income (tableName, price) VALUES ('${tableName}', ${price})`;
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