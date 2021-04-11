const CategoryModel = require('../model/category_model')
const catData = require('../util/category_data')
//this is used to handle all asynchrounous functions | an alternative to try catch
const asyncHandler = require('express-async-handler')

class CategoryController {

    // inserts data from form into category table
    createCategory = asyncHandler(async (request, response) => {

        let userInput = request.body.category_name;

        //console.log("userInput for addCategory is: ", userInput);

        if (userInput) {
            await CategoryModel.create(userInput)
            //response.send("Successfully added category");
            response.redirect('/categories');
        }
    })

    // form for adding category
    createForm = (request, response) => {
        let ad = false
        
        //if (request.session.admin == true) {
        if (request.session.admin == 1) {
            ad = true
        }

        response.render('add_category', { ad });
    }

    // gets the data from the category table and formats it so that it shows up on the pug file
    getAllCategories = asyncHandler(async (request, response) => {

        let ad = false
        
        //if (request.session.admin == true) {
        if (request.session.admin == 1) {
            ad = true
        }

        const c_data = await CategoryModel.findAll()
        let categoryData = [];

        if (c_data) {
            for (let i = 0; i < c_data.length; i++) {
                //populates categoryData[] list with catData objects defined in ('..util/category_data.js')
                categoryData[i] = new catData(
                    c_data[i].category_name,
                )
              }
            response.render('categories', { Group: categoryData, ad })
        }
    })
}

module.exports = new CategoryController;