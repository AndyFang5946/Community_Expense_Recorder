const express = require('express');
const router = express.Router();

const checkLogin = require('../middleware/check').checkLogin;

router.get('/', checkLogin, function(req, res, next){
    req.session.user = null;
    req.flash('success', 'Log Out Successfully');
    res.redirect('/post'); 
});

module.exports = router;