const db = require("../models");

module.exports = {
    findBySiteId: (req, res) => {
        db.SeriesSite
            .findOne({
                where: {
                    id: req.params.id
                },
                raw: true,
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    findAll: (req, res) => {
        db.SeriesSite
            .findAll({
                raw: true,
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    createSite: (req, res) => {
        db.SeriesSite
            .create(req.body)
            .then((updateResp) => {
                db.SeriesSite
                .findAll({
                    raw: true,
                })
                .then((updateResp) => {
                    res.json(updateResp);
                })
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    removeSite: (req, res) => {
        db.SeriesSite
            .destroy({
                where: {id: req.params.id},
                raw: true,
            })
            .then((deleteResp) => {
                db.SeriesSite
                .findAll({
                    raw: true,
                })
                .then((updateResp) => {
                    res.json(updateResp);
                })
            .catch((err) => {
                res.status(422).json(err);
            });
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    updateSite: (req, res) => {
        db.SeriesSite
            .update(req.body,
            {
                where: {id: req.body.id},
                raw: true,
            })
            .then((updateResp) => {
                db.SeriesSite
                .findAll({
                    raw: true,
                })
                .then((getResp) => {
                    res.json(getResp);
                })
                .catch((err) => {
                    res.status(422).json(err);
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(422).json(err);
            });
    },
};