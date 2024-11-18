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

export {
    getAllWithoutWarehouseDB
};