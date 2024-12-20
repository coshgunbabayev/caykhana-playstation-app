import db from '../main.js';

let sqlcommand;

async function getAllProductsDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM products WHERE (active)=("true")`;
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getAllProductsOneTypeDB(type) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM products WHERE (type,active)=("${type}","true")`;
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getProductDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM products WHERE (active,${param})=("true", ?)`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createAloneProductDB(type, name, category, sale) {
    sale = Number(sale.toFixed(2));
    sqlcommand = `INSERT INTO products (type, active, name, category, structure, quantity, purchase, sale, sold) VALUES ("${type}", "true", '${name}', '${category}', '', ${0}, ${0}, ${sale}, ${0})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function createSetProductDB(type, name, category, sale) {
    const structure = JSON.stringify({
        products: [],
        time: 0
    });

    sale = Number(sale.toFixed(2));
    sqlcommand = `INSERT INTO products (type, active, name, category, structure, quantity, purchase, sale, sold) VALUES ("${type}", "true", '${name}', '${category}', '${structure}', ${0}, ${0}, ${sale}, ${0})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function updateProductDB(id, params, values) {
    sqlcommand = `
        UPDATE products 
        SET ${params.map(param => `${param} = ?`).join(", ")} 
        WHERE id = ${id} AND active = "true"
    `;

    await db.run(sqlcommand, values, (err) => {
        if (err) return console.error(err);
    });
};

export {
    getAllProductsDB,
    getAllProductsOneTypeDB,
    getProductDB,
    createAloneProductDB,
    createSetProductDB,
    updateProductDB
};