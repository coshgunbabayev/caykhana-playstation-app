function getIndex(req, res) {
    res.status(200).render('worker/index');
};

function getAdminLogin(req, res) {
    res.status(200).render('admin/login');
};

function getAdmin(req, res) {
    res.status(200).render('admin/index', {
        activePage: 'home'
    });
};

function getTable(req, res) {
    res.status(200).render('admin/index', {
        activePage: 'table'
    });
};

function getWarehouse(req, res) {
    res.status(200).render('admin/index', {
        activePage: 'warehouse'
    });
};

function getWithoutWarehouse(req, res) {
    res.status(200).render('admin/index', {
        activePage: 'without-warehouse'
    });
};

function getExpense(req, res) {
    res.status(200).render('admin/index', {
        activePage: 'expense'
    });
};

export {
    getIndex,
    getAdminLogin,
    getAdmin,
    getTable,
    getWarehouse,
    getWithoutWarehouse,
    getExpense
};