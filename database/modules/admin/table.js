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

async function createTableDB(name, role) {
    sqlcommand = `INSERT INTO tables (name, role) VALUES ('${name}', '${role}')`;
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
    getAllTableDB,
    getTableDB,
    createTableDB,
    deleteTableDB
};