const db = require("../models");
const bcrypt = require("bcryptjs");

module.exports = {
    findByEmail: (req, res) => {
        db.User
            .findOne({
                where: {
                    email: req.params.email
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
    updateUser: (req, res) => {
        db.User
            .update({
                where: { email: req.params.email },
                raw: true,
            }, req.body)
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                res.status(422).json(err);
            });
    },
    signup: (req, res) => {
        db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        .then(() => {
            res.send("User Created");
        })
        .catch(err => {
            console.log(err);
            res.status(422).json(err);
        })
    }
};