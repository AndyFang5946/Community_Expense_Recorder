const express = require('express');
const router = express.Router();

const checkLogin = require('../middleware/check').checkLogin;
const commentModel = require('../models/comments');

router.post('/', checkLogin, function(req, res, next){
    const author = req.session.user._id;
    const postId = req.fields.postId;
    const content = req.fields.content;
    const vote = req.fields.vote;

    try{
        if(!content.length){
            throw new Error('lacking content');
        }
    }catch(e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let comment = {
        author: author,
        postId: postId,
        content: content,
        vote: vote
    }

    commentModel.create(comment).then(() => {
        req.flash('success', 'Comment Successfully');
        res.redirect(`/post/${postId}`);
    }).catch(next);
});

router.get('/:commentId/remove', checkLogin, function(req, res, next){
    const commentId = req.params.commentId;
    const author = req.session.user._id;
    
    commentModel.getCommentsById(commentId).then((comment) => {
        if(!comment){
            throw new Error('the comment does not exist');
        }
        if(author.toString() !== comment.author.toString()){
            throw new Error('lacking permission');
        }

        const postId = comment.postId;

        commentModel.delCommentById(commentId).then(() => {
            req.flash('success', 'Delete Successfully');
            res.redirect(`/post/${postId}`);
        }).catch(next);
    });
});

module.exports = router;