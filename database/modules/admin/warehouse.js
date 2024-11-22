import db from '../../main.js';

let sqlcommand;

async function getAllWarehouseDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = "SELECT * FROM warehouse";
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getWarehouseDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM warehouse WHERE ${param} = ?`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createWarehouseDB(name, sale) {
    sale = Number(sale.toFixed(2));
    sqlcommand = `INSERT INTO warehouse (name, quantity, purchase, sale) VALUES ('${name}', ${0}, ${0}, ${sale})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function updateWarehouseDB(id, name, sale) {
    sale = Number(sale.toFixed(2));
    sqlcommand = `UPDATE warehouse SET name = '${name}', sale = ${sale} WHERE id = ${id}`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err.message);
    });
};

async function automaticUpdateQuantityAndPurchaseofWarehouseDB(id, quantity, purchase) {
    purchase = Number(purchase.toFixed(2));
    sqlcommand = `UPDATE warehouse SET quantity = '${quantity}', purchase = ${purchase} WHERE id = ${id}`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err.message);
    });
};

async function deleteWarehouseDB(id) {
    sqlcommand = "DELETE FROM warehouse WHERE(id)=(?)";
    await db.run(sqlcommand, [id], (err) => {
        if (err) return console.error(err.message);
    });
};

export {
    getAllWarehouseDB,
    getWarehouseDB,
    createWarehouseDB,
    updateWarehouseDB,
    automaticUpdateQuantityAndPurchaseofWarehouseDB,
    deleteWarehouseDB
};