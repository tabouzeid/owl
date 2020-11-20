const db = require("../models");
const ROLES  = require("../config/middleware/roles");
const bcrypt = require("bcryptjs");

module.exports = {
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
        
        if(req.user.role === ROLES.ADMIN && req.body.role) {
            update['role'] = req.body.role;
        }
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