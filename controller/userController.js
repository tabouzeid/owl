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
        let update = {};
        if (req.body.email) {
            update["email"] = req.body.email;
        }

        if (req.body.name) {
            update["name"] = req.body.name;
        }

        if (req.body.password) {
            update["password"] = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null);
        }
        console.log("going to update to ", update);
        db.User
            .update(update,
                {
                    where: { id: req.user.id },
                    raw: true,
                }
            )
            .then((updateResp) => {
                res.json(updateResp);
            })
            .catch((err) => {
                console.log(err)
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