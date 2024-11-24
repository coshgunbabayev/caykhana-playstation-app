import db from '../../main.js';

let sqlcommand;

async function getAllProductsOneTypeDB(type) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM products WHERE (type,active)=("${type}","true")`;
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getProductDB(type, param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM products WHERE (type,active,${param})=("${type}", "true", ?)`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createProductDB(type, name, category, sale) {
    sale = Number(sale.toFixed(2));
    sqlcommand = `INSERT INTO products (type, active, name, category, quantity, purchase, sale, sold) VALUES ("${type}", "true", '${name}', '${category}', ${0}, ${0}, ${sale}, ${0})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function updateProductDB(id, name, sale) {
    sale = Number(sale.toFixed(2));
    sqlcommand = `UPDATE products SET name = '${name}', sale = ${sale} WHERE (id,active)=(${id}, "true")`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err.message);
    });
};

// async function automaticUpdateQuantityAndPurchaseofWarehouseDB(id, quantity, purchase) {
//     purchase = Number(purchase.toFixed(2));
//     sqlcommand = `UPDATE products SET quantity = '${quantity}', purchase = ${purchase} WHERE (type,active,id)=("warehouse", "true", ${id})`;
//     await db.run(sqlcommand, [], (err) => {
//         if (err) return console.error(err.message);
//     });
// };

async function setDisabledProductDB(id) {
    sqlcommand = `UPDATE products SET active = "false" WHERE(id)=(${id})`;
    await db.run(sqlcommand, [], (err) => {
        if (err) return console.error(err.message);
    });
};

export {
    getAllProductsOneTypeDB,
    getProductDB,
    createProductDB,
    updateProductDB,
    // automaticUpdateQuantityAndPurchaseofWarehouseDB,
    setDisabledProductDB
};