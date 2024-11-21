function getIndex(req, res) {
    res.status(200).render('index');
};

function getAdminLogin(req, res) {
    res.status(200).render('partials/admin/login');
};

function getAdmin(req, res) {
    res.status(200).render('partials/admin/index', {
        activePage: 'home'
    });
};

function getTables(req, res) {
    res.status(200).render('partials/admin/index', {
        activePage: 'table'
    });
};

function getWarehouse(req, res) {
    res.status(200).render('partials/admin/index', {
        activePage: 'warehouse'
    });
};

function getWithoutWarehouse(req, res) {
    res.status(200).render('partials/admin/index', {
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