import db from '../main.js';

let sqlcommand;

async function getAllTableDB() {
    return await new Promise((resolve, reject) => {
        sqlcommand = 'SELECT * FROM tables WHERE (active)=("true")';
        db.all(sqlcommand, [], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function getTableDB(param, value) {
    return await new Promise((resolve, reject) => {
        sqlcommand = `SELECT * FROM tables WHERE (${param}, active) = (?, "true")`;
        db.get(sqlcommand, [value], (err, data) => {
            if (err) { reject(err); }
            else { resolve(data); }
        });
    });
};

async function createTableDB(name, role) {
    sqlcommand = `INSERT INTO tables (name, active, role) VALUES ('${name}', "true", '${role}')`;
    await db.run(sqlcommand, (err) => {
        if (err) {
            throw new Error('')
        };
    });
};

async function deleteTableDB(id) {
    sqlcommand = 'UPDATE tables SET active = "false" WHERE(id)=(?)';
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