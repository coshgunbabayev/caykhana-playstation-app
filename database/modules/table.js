import db from '../../database/main.js';

let sqlcommand;

async function getAllTablesDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = "SELECT * FROM tables";
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createTableDB(name, role) {
    sqlcommand = `INSERT INTO tables (name, role) VALUES ('${name}', ${role})`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function deleteTableDB(id) {
    sqlcommand = "DELETE FROM tables WHERE(id)=(?)";
    await db.run(sqlcommand, [id], (err) => {
        if (err) return console.error(err.message);
    });
};

export {
    getAllTablesDB,
    createTableDB,
    deleteTableDB
};