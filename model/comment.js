let mongoose = require('mongoose');
let Article = require('../model/article');

let Schema = mongoose.Schema;

let comment = new Schema({
    article_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
    },
    parent_comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Comments'
    },
    comment: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    sub_comment_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comments'
    }]
});

module.exports = mongoose.model('Comments', comment);