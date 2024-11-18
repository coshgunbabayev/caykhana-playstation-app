function getIndex(req, res) {
    res.status(200).render('index');
};

function getAdminLogin(req, res) {
    res.status(200).render('admin-login');
};

function getAdmin(req, res) {
    res.status(200).render('admin', {
        activePage: 'home'
    });
};

function getTables(req, res) {
    res.status(200).render('admin', {
        activePage: 'tables'
    });
};

function getWarehouse(req, res) {
    res.status(200).render('admin', {
        activePage: 'warehouse'
    });
};

function getWithoutWarehouse(req, res) {
    res.status(200).render('admin', {
        activePage: 'without-warehouse'
    });
};

export {
    getIndex,
    getAdminLogin,
    getAdmin,
    getTables,
    getWarehouse,
    getWithoutWarehouse
};