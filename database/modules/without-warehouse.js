import db from '../../database/main.js';

let sqlcommand;

async function getAllWithoutWarehouseDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = "SELECT * FROM withoutWarehouse";
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createWithoutWarehouseDB(name, sale) {
    sqlcommand = `INSERT INTO withoutWarehouse (name, sale) VALUES ('${name}', ${sale})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function deleteWithoutWarehouseDB(id) {
    sqlcommand = "DELETE FROM withoutWarehouse WHERE(id)=(?)";
    await db.run(sqlcommand, [id], (err) => {
        if (err) return console.error(err.message);
    });
};

export {
    getAllWithoutWarehouseDB,
    createWithoutWarehouseDB,
    deleteWithoutWarehouseDB
};