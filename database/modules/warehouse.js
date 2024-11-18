import db from '../../database/main.js';

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

async function createWarehouseDB(name, sale) {
    sqlcommand = `INSERT INTO warehouse (name, quatity, purchase, sale) VALUES ('${name}', ${0}, ${0}, ${sale})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
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
    createWarehouseDB,
    deleteWarehouseDB
};