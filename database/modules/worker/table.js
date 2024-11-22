import db from '../../main.js';

let sqlcommand;

async function getAllTableDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM tables';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getTableDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM tables WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

export {
    getAllTableDB,
    getTableDB
};