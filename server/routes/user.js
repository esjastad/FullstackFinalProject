const express = require('express');
const router = express.Router();
const db = require('../queryDB');


// GET logged in user Ex endpoint: http://localhost:5000/user/current
router.get('/current', db.getCurrentUser);

// GET logout user Ex endpoint: http://localhost:5000/user/logout
router.get('/logout', (req, resp) => {
   req.session.destroy();
   resp.end();
})

// GET all users Ex endpoint: http://localhost:5000/user/users
router.get('/users', db.getUsers);

// GET user favorites, Ex endpoint: http://localhost:5000/user/favs/Jordan
router.get('/favs/:user', db.getUserFavorites);

// POST create new user, Ex endpoint: http://localhost:5000/user/adduser
// form body { loginname: username, password: user password }
router.post('/adduser', db.createUser);

// POST log user in, Ex endpoint: http://localhost:5000/user/login
// form body { loginname: username, password: user password }
router.post('/login', db.logUserIn);

// POST add drink to favorites, Ex endpoint: http://localhost:5000/user/favs/add
// form body { loginname: username, drinkid: drinkid }
router.post('/favs/add', db.addFavorite);

// POST update user score, Ex endpoint: http://localhost:5000/user/score
// form body { loginname: username, score: score}
router.post('/setscore', db.setScore);

module.exports = router;