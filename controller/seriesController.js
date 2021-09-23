const db = require("../models");
const axios = require("axios");

module.exports = {
    findBySiteId: (req, res) => {
        db.Series
            .findOne({
                where: {
                    seriesSiteId: req.params.id
                },
                raw: true,
                include: [db.SeriesSite],
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    findBySeriesId: (req, res) => {
        db.Series
            .findOne({
                where: {
                    id: req.params.id
                },
                raw: true,
                include: [db.SeriesSite],
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    findByUser: (req, res) => {
        db.Series.findAll(
            {
                where: {userId: req.user.id},
                raw: true,
                include: [db.SeriesSite]
            })
            .then((series) => {
                res.json(series);
            })
            .catch((err) => {
                console.log(err);
                res.status(422).json(err);
            });
    },
    findAll: (req, res) => {
        db.Series
            .findAll({
                raw: true,
                include: [db.SeriesSite],
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    createSeries: (req, res) => {
        db.Series
            .create({...req.body, userId: req.user.id})
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    removeSeries: (req, res) => {
        db.Series
            .destroy({
                where: {
                    id: req.params.id,
                    userId: req.user.id,
                },
                raw: true,
                include: [db.SeriesSite],
            })
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    updateSeries: (req, res) => {
        db.Series
            .update(
                req.body,
                {
                    where: {id: req.params.id},
                    raw: true,
                }
            )
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                console.log(err);
                res.status(422).json(err);
            });
    },
    markSeriesChecked: (req, res) => {
        db.Series
            .update(
                {
                    lastChecked: new Date(),
                    lastChapterViewed: req.body.lastChapter
                }, 
                {
                    where: {
                        id: req.params.id,
                        userId: req.user.id,
                    },
                    raw: true,
                }
            )
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                console.log(err);
                res.status(422).json(err);
            })
    }
};