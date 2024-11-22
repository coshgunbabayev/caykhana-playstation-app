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

async function getTimeDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM time WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

export {
    getAllTimeDB,
    getTimeDB
};