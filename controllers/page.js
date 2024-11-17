function getIndex(req, res) {
    res.status(200).render('index');
};

export {
    getIndex
};