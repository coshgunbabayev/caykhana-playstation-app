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

export {
    getAllTimeDB,
    getTimeOneTableDB
};