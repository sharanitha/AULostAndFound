let app = require('express').Router();

//model
const CategoryModel = require("../model/category_model")

//controller
const CategoryController = require('../controller/category_controller')

module.exports = (() => {

    app.get('/categories', CategoryController.getAllCategories)

    app.route('/addCategory')
        .get(CategoryController.createForm)
        .post(CategoryController.createCategory)

    return app;
})();