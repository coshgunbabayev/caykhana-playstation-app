function getIndex(req, res) {
    res.status(200).render('index');
};

function getAdminLogin(req, res) {
    res.status(200).render('admin-login');
};

function getAdmin(req, res) {
    res.status(200).render('admin');
};

export {
    getIndex,
    getAdminLogin,
    getAdmin
};