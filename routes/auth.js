const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../db'); // Adjust the path based on your project structure

module.exports = function (passport) {
    const router = express.Router();

    // Registration route
    router.post('/register', async (req, res) => {
        // inside post
        const { email, password } = req.body;
        try {
            // Generate userId without dashes (-) with a length of 12 characters
            const userId = uuidv4().replace(/-/g, "").slice(0, 24);
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create user in the database with the generated userId
            const user = await prisma.user.create({
                data: {
                id: userId,
                email,
                password: hashedPassword,
                },
            });
            // This uses one of passport's injected methods to login the user
            // after successful creation
            req.login({ id: user.id, email: user.email }, function (err) {
                // Error handling....could be better here.
                if (err) {
                console.log(err);
                } else {
                // Successful login sends the user to the dashboard
                res.redirect("/dashboard");
                }
            });

        } catch(e){
            console.error(e);
            res.status(500).json({ error: 'Internal server error.' });
        }

    })

    // post request is made when user navigates to login
    // first param login, second param .authenticate
    router.post('/login', passport.authenticate(local, {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    }) , async (req, res) => {

    })

    // for the user to logout.
    // req.logout will destroy the session that passport created
    router.post("/logout", function (req, res, next) {
        req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
        });
    });

    return router;
};

