const express = require('express');
const router = express.Router();
const postModel = require('../models/posts');
const commentModel = require('../models/comments');

const checkLogin = require('../middleware/check').checkLogin;

router.get('/', function(req, res, next){
    const author = req.query.author;
    postModel.getPosts(author).then((posts) => {
        res.render('post', {
            posts: posts
        });
    }).catch(next);
});

router.post('/create', checkLogin, function(req, res, next){
    const author = req.session.user._id; 
    const title = req.fields.title;
    const amount = req.fields.amount;
    const des = req.fields.content;

    try{
        if(!title.length){
            throw new Error('lacking title');
        }
        if(!amount.length){
            throw new Error('lacking amount');
        }
        if(!des.length){
            throw new Error('lacking description');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let post = {
        author: author,
        title: title,
        expense: Number(amount),
        content: des
    }

    postModel.create(post).then((result) => {
        post = result.ops[0];
        req.flash('success', 'Post Successfully');
        res.redirect(`/post/${post._id}`);
    }).catch(next);
});

router.get('/create', checkLogin, function(req, res, next){
    res.render('create');
});

router.get('/:postId',function(req, res, next){
    const postId = req.params.postId;

    Promise.all([postModel.getPostbyId(postId),
        commentModel.getComments(postId),
        postModel.incPv(postId)]).then((result) => {
        const post = result[0];
        const comment = result[1];
        if(!post){
            throw new Error('the post does not exist');
        }
        res.render('post-detail', {
            post: post,
            comments: comment
        });
    }).catch(next);
});

router.get('/:postId/edit', checkLogin, function(req, res, next){
    const postId = req.params.postId;
    const author = req.session.user._id;

    postModel.getRawPostById(postId).then((post) => {
        if(!post){
            throw new Error('the post does not exist');
        }
        if(author.toString() !== post.author._id.toString()){
            throw new Error('lacking permission');
        }
        res.render('edit', {
            post: post
        });
    }).catch(next);
});

router.post('/:postId/edit', checkLogin, function(req, res, next){
    const postId = req.params.postId;
    const author = req.session.user._id; 
    const title = req.fields.title;
    const amount = req.fields.amount;
    const des = req.fields.content;

    try{
        if(!title.length){
            throw new Error('lacking title');
        }
        if(!amount.length){
            throw new Error('lacking amount');
        }
        if(!des.length){
            throw new Error('lacking description');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    postModel.getRawPostById(postId).then((post) => {
        if(!post){
            throw new Error('the post does not exist');
        }
        if(author.toString() !== post.author._id.toString()){
            throw new Error('lacking permission');
        }
        postModel.updatePostById(postId, {
            title: title,
            expense: Number(amount),
            content: des}).then((result) => {
                req.flash('success', 'Update Successfully');
                res.redirect(`/post/${postId}`);
        }).catch(next);
    });
});

router.get('/:postId/remove', checkLogin, function(req, res, next){
    const postId = req.params.postId;
    const author = req.session.user._id;

    postModel.getRawPostById(postId).then((post) => {
        if(!post){
            throw new Error('the post does not exist');
        }  
        if(author.toString() !== post.author._id.toString()){
            throw new Error('lacking permission');
        }
        postModel.deletePostById(postId).then(() => {
            req.flash('success', 'Delete Successfully');
            res.redirect('/post');
        }).catch(next);
    });
});

module.exports = router;