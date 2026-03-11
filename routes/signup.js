const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const userModel = require('../models/users');
const checkNotLogin = require('../middleware/check').checkNotLogin;

router.get('/', checkNotLogin, function(req, res, next){
    res.render('signup');
});

router.post('/', checkNotLogin, function(req, res, next){
    const name = req.fields.name;
    const bio = req.fields.bio;
    const avatar = req.files.avatar.path.split('public')[1];
    let password = req.fields.password;
    const repassword = req.fields.repassword;

    try{
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('the name should be between 1 and 10 characters');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error('the bio should be between 1 and 30 characters');
        }
        if (!req.files.avatar.name) {
            throw new Error('lacking avatar');
        }
        if (password.length < 6) {
            throw new Error('the password should be at least 6 characters');
        }
        if (password !== repassword) {
            throw new Error('the passwords does not match');
        }
    }catch(e){
        fs.unlink(req.files.avatar.path, (e) => {
            if(e) console.log(e.message);
        });
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    password = sha1(password);

    let user = {
        name: name,
        password: password,
        avatar: avatar,
        bio: bio
    }

    userModel.create(user).then((result) => {
        user = result.ops[0];
        delete user.password;
        req.session.user = user;
        req.flash('success', 'Sign Up Successfully');
        res.redirect('/post');
    }).catch((e) => {
        fs.unlink(req.files.avatar.path, (e) => {
            if(e) console.log(e.message);
        });
        if(e.message.match('duplicate key')){
            req.flash('error', 'the user name is already taken');
            res.redirect('/signup');
        }
        next(e);
    });
});

module.exports = router;   