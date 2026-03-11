const config = require('config-lite');
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
    name: {type: 'string', required: true},
    password: {type: 'string', required: true},
    avatar: {type: 'string', required: true},
    bio: {type: 'string', required: true}
});
exports.User.index({name: 1}, {unique: true}).exec();

mongolass.plugin('addCreatedAt', {
    afterFind: function(results){
        results.forEach(function(item){
            item.createdAt = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },

    afterFindOne: function(result){
        if(result){
            result.createdAt = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

exports.Post = mongolass.model('Post',{
    author: {type: Mongolass.Types.ObjectId, required: true},
    title: {type: 'string', required: true},
    expense: {type: 'number', required: true},
    content: {type: 'string', required: true}, 
    pv: {type: 'number', default: 0}
});
exports.Post.index({author: 1, _id: -1}).exec();

exports.Comment = mongolass.model('Comment',{
    author: {type: Mongolass.Types.ObjectId, required: true},
    content: {type: 'string', required: true},
    vote: {type: 'string', enum: ['up', 'down', 'none'], default: 'none'},
    postId: {type: Mongolass.Types.ObjectId, required: true},
});
exports.Comment.index({postId: 1, _id: 1}).exec();