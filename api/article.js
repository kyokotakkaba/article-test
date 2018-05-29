let express = require('express');
let router = express.Router();

let Response = require('../services/response');

let Article = require('../model/article');
let Comment = require('../model/comment');

router.get('/filter/:limit?/:skip?', (req, res) => {
    Article
        .find()
        .populate({
            path: 'comment_ids',
            model: 'Comments',
            populate: {
                path: 'sub_comment_ids',
                model: 'Comments',
                populate: {
                    path: 'sub_comment_ids',
                    model: 'Comments'
                }
            }
        })
        .skip(parseInt(req.params.skip))
        .limit(parseInt(req.params.limit))
        .exec((err, data) => {
            if (err) {
                res.status(500).send(Response.error(500, err.message));
            }
            res.json(Response.success(data));
        });
});

router.get('/get/:id', (req, res) => {
    Article.findById(req.params.id)
        .populate({
            path: 'comment_ids',
            model: 'Comments',
            populate: {
                path: 'sub_comment_ids',
                model: 'Comments',
                populate: {
                    path: 'sub_comment_ids',
                    model: 'Comments'
                }
            }
        })
        .exec((err, data) => {
            if (err) {
                res.status(500).send(Response.error(500, err.message));
            }
            res.json(Response.success(data));
        });
});

router.post('/add', (req, res) => {
    var data = req.body;
    Article.create(data, (err, data) => {
        if (err) {
            res.status(500).send(Response.error(500, err.message));
        }
        res.json(Response.success(data));
    });
});

router.put('/edit/:id', (req, res) => {
    var id = req.params.id;
    var data = req.body;
    var query = {
        _id: id
    };
    Article.findOneAndUpdate(query, data, (err, data) => {
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
    Article.remove(query, (err, data) => {
        if (err) {
            res.status(500).send(Response.error(500, err.message));
        }
        res.json(Response.success(data));
    });
});

module.exports = router;