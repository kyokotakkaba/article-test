let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let article = new Schema({
    title: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    comment_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comments'
    }]
});

module.exports = mongoose.model('Article', article);