// Routes
// =============================================================
const bcrypt = require("bcryptjs");
const {DateTime} = require("luxon");

const db = require("../models");
const manganeloParser = require("../parser/ManganeloHandler");
const AccessMiddleware = require("../config/middleware/isAuthenticated");
const seriesController = require('../controller/seriesController');
const siteController = require('../controller/siteController');
const userController = require('../controller/userController');

module.exports = function(app) {
    app.get('/api/user/', AccessMiddleware.hasAccess, (req, res) => {
        res.json(
            {
                name: req.user.name,
                email: req.user.email,
            }
        );
    });

    app.put('/api/user/', AccessMiddleware.hasAccess, async (req, res) => {
        if (req.body.currentPassword) {
            const passwordMatch = await bcrypt.compare(req.body.currentPassword, req.user.password)
            if (!passwordMatch) {
                res.status(421).json({ msg: "password doesn't match" })
            }
        }
        userController.updateUser(req, res);
    });

    app.get('/api/site', AccessMiddleware.hasAccess, (req, res) => {
        siteController.findAll(req, res);
    });

    app.post('/api/site', AccessMiddleware.hasAdminAccess, (req, res) => {
        siteController.createSite(req, res);
    });

    app.put('/api/site', AccessMiddleware.hasAdminAccess, (req, res) => {
        siteController.updateSite(req, res);
    });

    app.delete('/api/site/:id', AccessMiddleware.hasAdminAccess, (req, res) => {
        siteController.removeSite(req, res);
    });
    
    app.post('/api/series', AccessMiddleware.hasAccess, (req, res) => {
        seriesController.createSeries(req, res);
    });

    app.get('/api/series/:id', AccessMiddleware.hasAccess, (req, res) => {
        db.Series.findAll(
            {
                where: { 
                    id: req.params.id,
                    userId: req.user.id
                },
                raw: true,
                include: [db.SeriesSite]
            }
        ).then(async (seriesList)  => {
            getUpdatesForSeriesList(seriesList, req, res);
        }).catch((err) => {
            console.log(err);
            res.status(422).json(err);
        })
    });

    app.put('/api/series', AccessMiddleware.hasAccess, (req, res) => {
        seriesController.updateSeries(req, res);
    });

    app.delete('/api/series/:id', AccessMiddleware.hasAccess, (req, res) => {
        seriesController.removeSeries(req, res);
    });

    app.put('/api/series/:id/mark_last_checked', AccessMiddleware.hasAccess, (req, res) => {
        seriesController.markSeriesChecked(req, res);
    });

    app.get('/api/series', AccessMiddleware.hasAccess, (req, res) => {
        seriesController.findByUser(req, res);
    });

    app.get('/api/series/updates', AccessMiddleware.hasAccess, (req, res) => {
        db.Series.findAll(
            {
                where: { userId: req.user.id},
                raw: true,
                include: [db.SeriesSite]
            }
        ).then((seriesList)  => {
            res.json(seriesList);
            // getUpdatesForSeriesList(seriesList, req, res);
        }).catch((err) => {
            console.log(err);
            res.status(422).json(err);
        })
    });

    app.get('/api/series/updates/:id', AccessMiddleware.hasAccess, (req, res) => {
        db.Series.findAll(
            {
                where: { userId: req.user.id,  seriesSiteId: req.params.id},
                raw: true,
                include: [db.SeriesSite]
            }
        ).then(async (seriesList)  => {
            getUpdatesForSeriesList(seriesList, req, res);
        }).catch((err) => {
            console.log(err);
            res.status(422).json(err);
        })
    });

    //////////////////////

    async function getUpdatesForSeriesList(seriesList, req, res) {
        for (const series of seriesList) {
            const seriesUrl = series['SeriesSite.seriesUrlTemplate'].replace('${seriesId}', series.seriesIdOnSite);
            const latestChapter = await manganeloParser.getLatestManganeloChapter(seriesUrl);
            
            let hasUpdate = false;
            if (latestChapter > series.lastChapterViewed){
                hasUpdate = true;
            }
            series.hasUpdate = hasUpdate;
            series.latestChapter = latestChapter; 
        }
        res.json(seriesList);
    }
};
