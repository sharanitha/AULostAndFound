//this is used to handle all asynchrounous functions | an alternative to try catch 
const asyncHandler = require('express-async-handler')
//model
const CategoryModel = require("../model/category_model")
//controller
const AccountController = require('../controller/account_controller')
const AdminController = require('../controller/admin_controller')
let signupVerify = require('../controller/account_verify')

//middleware
let user_session = require("../middleware/logged-status");
let signup_handler = require("../middleware/signup_route_handler")

let clear = require("../util/clear");

module.exports = (() => {
    'use strict';
    let app = require('express').Router();

    app.get('/', asyncHandler(async function (request, response) {
        response.cookie('signup', { both: false, email: false, password: false }, { signed: true })
        if (request.session.loggedin) {
            response.redirect("/home")
        } else {
            response.redirect("/login")
        }
    }));


    //log in page
    app.get('/login', function (request, response) {
        if (request.session.valid) {
            request.session.valid = null;
            response.render('login', { wrongInfo: true })
        } else {
            response.render('login')
        }
    })

    //sign up page 
    //the cookies are used to keep track of any errors
    app.get('/signup', signup_handler, asyncHandler(async (request, response) => {

        if (!request.session.loggedin) {
            response.cookie('signup', { both: false, email: false, password: false }, { signed: true })
            let input = { type: request.signup.invalid }
            clear()
            response.render('signup', input)
        }
        else {
            response.redirect("/logout")
        }
    }));

    //the middleware authorizes and then redirect to home page
    app.post('/auth', AccountController.auth, (request, response) => {
        // console.log(request.session.user_id)
        response.redirect('/home');
    });


    //this route is used to create an account
    //it is the current action for /signup form
    //it first takes the given information and verifies that it does not exist already
    //then it creates theuser with the createUser() function 
    //it will then render the success page which has a link to the login page
    
    app.post('/createUser', asyncHandler(async (request, response) => {
        response.clearCookie('signup')
        // console.log("create level", request.signedCookies)

        let userInput = await signupVerify(request.body.email, request.body.password, request.body.passwordRetype,
            request.body.first_name, request.body.last_name, request.body.phone_number , request, response)

        //console.log('The user input is', userInput);

        if (userInput) {
            await UserModel.create(userInput)
            
            response.redirect(307, '/success');
        }
    }))

    app.get('/test', (request, response) => {
        response.render('create-profile', { variables: options.selectOption })
    })

    //move to admin-controller file
    //this is a middleware function that loads the admin homepage depending if they are admin other wise render the default page
    let admin_homepage = asyncHandler(async (request, response, next) => {

        if (request.session.admin) {
            // console.log("activeChecker(1) =", activeChecker(0))
            let current_active_members = await AdminController.getActiveUsers()
            let ad = true
            // console.log(current_active_members)
            // console.log(request.session.account)
            // console.log(current_active_members.active)
            response.render('admin-homepage', {current_active_members , ad})
            // response.send("You are admin")
        } else {
            return next()
        }
    })
    //the home page route
    app.get('/home', function (request, response) {
        let info = request.session
        console.log("request.session = ", info);
        let ad = false
        
        //if (request.session.admin == true) {
        if (request.session.admin == 1) {
            ad = true
        }

        response.render('home', { info, ad })
    });

    //this is the log out page /function
    app.get('/logout', user_session, (request, response) => {
        request.session.destroy();
        response.redirect("/login")
    })

    app.post('/success', (request, response) => {
        request.session.valid = null;
        request.session.invalid = null;
        response.render("success")
        response.end();
    })
    //this should be applied to the else statements if the person is not logged in or what not
    app.get('/restricted', (request, response) => {
        response.status(400).send("Permision denied") //make a pug file
        response.end();
    })




    return app;
})();