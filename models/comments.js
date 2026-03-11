const marked = require('marked');
const Comments = require("../lib/mongo").Comment;

Comments.plugin('contentToHtml', {
    afterFind: function (comments){
        return comments.map(function (comment){
            comment.content = marked.parse(comment.content);
            return comment;
        });
    }
});

module.exports = {
    create: function create(comment){
        return Comments.create(comment).exec();
    },

    getCommentsById: function getCommentsById(commentId){
        return Comments.findOne({_id: commentId}).exec();
    },

    delCommentById: function delCommentById(commentId){
        return Comments.deleteOne({_id: commentId}).exec();
    },

    delCommentByPostId: function delCommentByPostId(postId){
        return Comments.deleteMany({postId: postId}).exec();
    },

    getComments: function getComments(postId){
        return Comments.find({postId: postId}).populate({path: 'author', model: 'User'}).sort({_id: -1}).addCreatedAt().contentToHtml().exec();
    },

    getCommentsCount: function getCommentsCount(postId){
        return Comments.count({postId: postId}).exec();
    }
};