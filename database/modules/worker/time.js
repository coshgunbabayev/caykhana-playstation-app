import db from '../../main.js';

let sqlcommand;

async function getAllTimeDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM time';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getTimeOneTableDB(tableId) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM time WHERE tableId = ${tableId}`;
        db.get(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createTimeDB(tableId, type, isSet, time = 0) {
    const now = new Date().toISOString();
    sqlcommand = `INSERT INTO time (tableId, type, isSet, start, time) VALUES (${tableId}, '${type}', '${isSet}', '${now}', ${time})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            console.log(err);

            throw new Error('')
        };
    });
};

export {
    getAllTimeDB,
    getTimeOneTableDB,
    createTimeDB
};