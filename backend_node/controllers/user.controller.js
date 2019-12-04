var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const saltRounds = 10000;
const keylength = 512;
const alg = 'sha512';
const tokenExpiry = "1h"
const User = require('../models/user.model.js');


exports.signup = (req, res) => {

    User.findOne({ email: req.body.email })
        .then(data => {
            if (data) {
                return res.status(200).send({ message: "Username already registered. Please Log in" })
            }
            else {
                //signup new user
                let salt = crypto.randomBytes(16).toString('hex');
                let hash = crypto.pbkdf2Sync(req.body.password, salt, saltRounds, keylength, alg).toString('hex');
                var userObj = {
                    "username": req.body.username,
                    "password": hash,
                    "salt": salt,
                    "email": req.body.email,
                    "emailverified": false,
                    "usertype": "user",
                    "signupmethod": "registration"
                };
                const user = new User(userObj);
                user.save()
                    .then(data => {
                        var objToken = {
                            "email": userObj.email,
                            "id": data["_id"],
                            "name": userObj.username,
                            "emailverified": data["emailverified"],
                            "userType": data["usertype"]
                        }
                        let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                        res.status(200).send({ "statusCode": 200, "result": objToken, "WWW-Authenticate": token });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "An error occured while signing up"
                        })
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occured while signing up"
            })
        });

};

exports.validatelogin = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if (!data) return res.status(400).send({ message: "Please enter valid username/password" })
            if (!data["active"]) return res.send({ statusCode: 400, message: "Account deactivated, please contact admin" })

            const hash = crypto.pbkdf2Sync(req.body.password, data.salt, saltRounds, keylength, alg).toString('hex');
            if (hash == data.password) {
                var objToken = {
                    "email": data.email,
                    "id": data["_id"],
                    "name": data.username,
                    "emailverified": data["emailverified"],
                    "userType": data["usertype"]
                }
                let token = jwt.sign(objToken, req.secret, { expiresIn: tokenExpiry });
                res.status(200).send({ "statusCode": 200, "result": objToken, "WWW-Authenticate": token });
            }
            else return res.status(400).send({ message: "Please enter valid username/password" })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "An error occured while logging in"
            })
        });
};