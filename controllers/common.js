import {
    getAllCategoryDB,
    getCategoryDB
} from '../database/modules/category.js'

async function getCategory(req, res) {
    const categories = await getAllCategoryDB();
    res.status(200).json({
        categories
    });
};

export {
    getCategory
};