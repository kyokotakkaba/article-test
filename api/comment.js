let express = require('express');
let router = express.Router();

let Response = require('../services/response');

let Article = require('../model/article');
let Comments = require('../model/comment');

router.get('/filter/:limit?/:skip?', (req, res) => {
    Comments
        .find()
        .populate({
            path: 'sub_comment_ids',
            model: 'Comments',
            populate: {
                path: 'sub_comment_ids',
                model: 'Comments'
            }
        })
        .where('parent_comment_id').equals(undefined)
        .skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit))
        .exec((err, data) => {
            if (err) {
                res.status(500).send(Response.error(500, err.message));
            }
            res.json(Response.successFilter(data.length, parseInt(req.params.limit), data));
        });
});

router.get('/get/:id', (req, res) => {
    Comments.findById(req.params.id)
        .populate({
            path: 'sub_comment_ids',
            model: 'Comments',
            populate: {
                path: 'sub_comment_ids',
                model: 'Comments'
            }
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).send(Response.error(500, err.message));
            }
            res.json(Response.success(data));
        });
});

router.get('/get/byArticle/:id', (req, res) => {
    Comments
        .find()
        .populate({
            path: 'sub_comment_ids',
            model: 'Comments',
            populate: {
                path: 'sub_comment_ids',
                model: 'Comments'
            }
        })
        .where('article_id').equals(req.params.id)
        .where('parent_comment_id').equals(undefined)
        .exec((err, data) => {
            if (err) {
                res.status(500).send(Response.error(500, err.message));
            }
            res.json(Response.success(data));
        });

});

router.post('/add', (req, res) => {
    var data = req.body;
    var item = new Comments(data);
    item.save(function (err) {
        if (data.parent_comment_id != undefined) {
            Comments.findById(data.parent_comment_id, (err, response) => {
                if (response) {
                    response.sub_comment_ids.push(item);
                    response.save((err, data) => {
                        if (err) {
                            res.status(500).send(Response.error(500, err.message));
                        }
                        res.json(Response.success(data));
                    });
                } else {
                    res.status(404).send(Response.error(404, 'Data not found.'));
                }
            })
        } else {
            Article.findById(data.article_id)
                .exec((err, data) => {
                    data.comment_ids.push(item);
                    data.save((err, data) => {
                        if (err) {
                            res.status(500).send(Response.error(500, err.message));
                        }
                        res.json(Response.success(data));
                    });
                });
        }
    });
});

router.put('/edit/:id', (req, res) => {
    var id = req.params.id;
    var data = req.body;
    var query = {
        _id: id
    };
    Comments.findOneAndUpdate(query, data, (err, data) => {
        if (err) {
            res.status(500).send(Response.error(500, err.message));
        }
        res.json(Response.success(data));
    });
});

router.delete('/remove/:id', (req, res) => {
    var id = req.params.id;
    var query = {
        _id: id
    };
    Comments.remove(query, (err, data) => {
        if (err) {
            res.status(500).send(Response.error(500, err.message));
        }
        res.json(Response.success(data));
    });
});

module.exports = router;