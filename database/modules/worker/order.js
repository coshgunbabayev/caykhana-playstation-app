import db from '../../main.js';

let sqlcommand;

async function getAllOrderDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM "order"';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getOrderOneTableDB(tableId) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM "order" WHERE tableId = ${tableId}`;
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getOrderDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM "order" WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createOrderDB(tableId, productId, quantity) {
    const now = new Date().toISOString();
    sqlcommand = `INSERT INTO "order" (tableId, productId, quantity, start) VALUES (${tableId}, ${productId}, ${quantity}, '${now}')`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            console.log(err);

            throw new Error('')
        };
    });
};

async function updateOrderDB(id, param, value) {
    sqlcommand = `UPDATE "order" SET ${param} = ${value} WHERE id = ${id}`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err);
    });
};

async function deleteOrderDB(id) {
    const sqlcommand = `DELETE FROM "order" WHERE id = ${id}`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err);
    });
};

export {
    getAllOrderDB,
    getOrderOneTableDB,
    getOrderDB,
    createOrderDB,
    updateOrderDB,
    deleteOrderDB
};