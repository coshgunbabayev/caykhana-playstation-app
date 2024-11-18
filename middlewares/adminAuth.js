import jwt from 'jsonwebtoken';

function authenticateForPage(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        console.log(123);
        return res.redirect('/login');
    };

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log(345);
        return res.redirect('/login');
    };

    if (decoded.id !== process.env.ID) {
        console.log(3434343);
        return res.redirect('/login');
    };

    next();
};

function authenticateForApi(req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return res.status(400).json({
            message: 'AdminNotAuthenticated'
        });
    };

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(400).json({
            message: 'AdminNotAuthenticated'
        });
    };

    if (decoded.id !== process.env.ID) {
        return res.status(400).json({
            message: 'AdminNotAuthenticated'
        });
    };

    next();
};

export {
    authenticateForPage,
    authenticateForApi
};