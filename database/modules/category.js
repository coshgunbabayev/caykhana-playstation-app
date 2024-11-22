import db from '../main.js';

let sqlcommand;

async function getAllCategoryDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM categories';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getCategoryDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM categories WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

export {
    getAllCategoryDB,
    getCategoryDB
};