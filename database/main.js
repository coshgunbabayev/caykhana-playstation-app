import sqlite3 from 'sqlite3';
sqlite3.verbose();
const { OPEN_READWRITE } = sqlite3;

const db = new sqlite3.Database("./database/main.db",
    sqlite3 / OPEN_READWRITE,
    (err) => {
        if (err) {
            return console.error(err.message);
        };
    }
);

export default db;