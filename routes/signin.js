const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const UserModel = require('../models/users');
const checkNotLogin = require('../middleware/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next){
    res.render('signin');  
});

router.post('/', checkNotLogin, function(req, res, next){
    const name = req.fields.name;
    const password = req.fields.password;

    try{
        if(!name.length){
            throw new Error('lacking name');
        }
        if(!password.length){
            throw new Error('lacking password');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    UserModel.getUserByName(name).then((user) => {
        if(!user){
            req.flash('error', 'the user does not exist');
            return res.redirect('back');
        }
        if(sha1(password) !== user.password){
            req.flash('error', 'the password is incorrect');
            return res.redirect('back');
        }
        req.flash('success', 'Log In Successfully');
        delete user.password;
        req.session.user = user;
        console.log(req.session.user.name);
        res.redirect('/post');
    }).catch(next);
});

module.exports = router;