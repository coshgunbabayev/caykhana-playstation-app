import db from '../../main.js';

let sqlcommand;

async function getAllOrderDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM order';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getOrderDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM order WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getMoreThanOneOrderDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM "order" WHERE ${param} = ?`;
        db.all(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

export {
    getAllOrderDB,
    getOrderDB,
    getMoreThanOneOrderDB
};