/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');

/*Render login page to user*/
module.exports = function(io) {
    router.get('/', function(req, res, next) {
        res.render('login');
    });

    /*To validate existing account*/
    router.post('/loginUser', function(req, res) {

        var username = req.body.loginUsername;
        var password = req.body.loginPassword;
        //if usernames exists and password match, issue a token
        models.USERS.findOne({
            where: {
                user_id: username,
                password: password
            }
        })
            .then(function(user) {
                if (user.acc_active === 1) {
                    var exdate = new Date();
                    var expires = exdate.getTime() + (1 * 24 * 60 * 60 * 1000);
                    var token = jwt.encode({
                        iss: username,
                        exp: expires
                    }, "mayday");

                    //add the user to online and delete from offline
                    global.users[username] = user;
                    global.online[username] = user;
                    delete global.offline[user.user_id];

                    //idle array is not used currently
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token,
                        expires: expires,
                        user: username
                    });
                } else {
                    res.status(500).send({
                        error: 'Your user id is inactive!'
                    });
                }

            }).catch(function(e) {
                res.status(500).send({
                    error: 'Username or Password is not correct!'
                });
            });

    });

    /*respones to signup request*/
    router.post('/signupUser', function(req, res) {
        var username = req.body.loginUsername;
        var password = req.body.loginPassword;
        var exdate = new Date();
        var expires = exdate.getTime() + (1 * 24 * 60 * 60 * 1000);
        //confirm with db if the username already exists or not
        models.USERS.findOne({
            where: {
                user_id: username
            }
        })
            .then(function(user) {
                if (user !== null && password === user.password) {
                    if (user.acc_active === 1) {
                        var token = jwt.encode({
                            iss: username,
                            exp: expires
                        }, "mayday");

                        global.users[username] = user;
                        global.online[username] = user;
                        delete global.offline[user.user_id];

                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            expires: expires,
                            user: username
                        });

                    } else {
                        res.status(500).send({
                            error: 'Your user id is inactive!'
                        });
                    }

                } else if (user.user_id) {
                    res.status(500).send({
                        error: 'Username taken! Try another!'
                    });
                }
            }).catch(function(e) {
                models.USERS.create({
                    user_id: username,
                    password: password
                })
                    .then(function(user) {
                        var token = jwt.encode({
                            iss: username,
                            exp: expires
                        }, "mayday");
                        //add the new user to global
                        var userValue = user;
                        global.users[username] = userValue;
                        global.online[username] = userValue;
                        delete global.offline[username];
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            expires: expires,
                            user: username
                        });
                    }).catch(function(e) {
                        res.status(500).send({
                            error: 'Username taken! Try another!'
                        });
                    });
            });

    });


    return router;
};