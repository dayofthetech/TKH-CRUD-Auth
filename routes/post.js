const express = require('express');
const prisma = require('../db');
const {checkIfAuthenticated} = require("./authMiddleware");

const router = express.Router();

router.post('/create-post', checkIfAuthenticated() ,async (req, res) => {
    try {
        const { email, password } = req.body;
        const userId = req.user.id;

        // Create a new post associated with the userId
        await prisma.post.create({
            data: {
            title,
            content,
            userId,
            },
        });

        res.redirect("/dashboard");

    } catch(e){
        console.error(e);
        res.status(500).json({ error: 'Internal server error.' });
    }
})