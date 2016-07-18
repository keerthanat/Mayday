/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');


module.exports = function(io) {
    router.get('/:active', function(req, res) {
        var active = req.params.active;
        var acc_active = 1;
        if (active === 'inactive') {
            acc_active = 0;
        }
        models.USERS.findAll({
            where: {
                acc_active: acc_active
            }
        })
            .then(function(users) {
                res.status(200).json({
                    success: true,
                    message: 'Fetched User List!',
                    users: users
                });

            }).catch(function(e) {
                res.status(500).send({
                    error: 'No user found!'
                });
            });
    });
    router.put('/:active/:uid', function(req, res) {
        var active = req.params.active;
        var acc_active = 1;
        if (active === 'inactive') {
            acc_active = 0;
        }
        var uid = req.params.uid;
        models.USERS.update({
            acc_active: acc_active
        }, {
            where: {
                user_id: uid
            }
        }).then(function(user) {
            models.USERS.findOne({
                where: {
                    user_id: uid
                }
            })
                .then(function(user) {
                    var userValue = user;
                    if (global.online[user.user_id] !== null && global.online[user.user_id]) {
                        if (user.acc_active === 0) {
                            delete global.online[user.user_id];
                            for (var i = 0; i < io.sockets.length; i++) {
                                var socket = io.sockets[i];
                                var uid = socket.uid;
                                if (uid !== undefined && uid !== "" && (uid === req.body.user_id || uid === req.body.user_id)) {
                                    socket.emit('logout');
                                }
                            }
                        } else if (user.acc_active === 1)
                            global.online[user.user_id] = userValue;
                    } else {
                        if (user.acc_active === 0)
                            delete global.offline[user.user_id];
                        else if (user.acc_active === 1)
                            global.offline[user.user_id] = userValue;
                    }
                    if (user.acc_active === 0)
                        delete global.users[user.user_id];
                    else if (user.acc_active === 1)
                        global.users[user.user_id] = userValue;
                    res.json({
                        success: true,
                        message: 'User updated successfully!',
                        uid: user.user_id
                    });
                });
        }).catch(function(e) {
            res.status(500).send({
                error: 'Error in updating user!'
            });
        });
    });
    router.post('/updateUser/:admin/:uid', function(req, res) {
        if (global.users[req.params.admin].privilege === 4) {
            var uid = req.params.uid;
            var columns = Object.keys(req.body);
            models.USERS.update(
                req.body, {
                    where: {
                        user_id: uid
                    }
                }
            ).then(function(user) {
                var uid = req.body.user_id ? req.body.user_id : req.params.uid;
                models.USERS.findOne({
                    where: {
                        user_id: uid
                    }
                })
                    .then(function(user) {
                        var userValue = user;
                        if (global.online[user.user_id] !== null && global.online[user.user_id]) {
                            if (req.body.user_id || user.acc_active === 0) {
                                delete global.online[user.user_id];
                                for (var i = 0; i < io.sockets.length; i++) {
                                    var socket = io.sockets[i];
                                    var uid = socket.uid;
                                    if (user.acc_active === 0 && uid !== undefined && uid !== "" && (uid === req.body.user_id || uid === req.body.user_id)) {
                                        socket.emit('logout');
                                    }
                                }
                            }
                            if (user.acc_active === 1)
                                global.online[user.user_id] = userValue;
                        } else {
                            if (req.body.user_id || user.acc_active === 0)
                                delete global.offline[user.user_id];
                            else if (user.acc_active === 1)
                                global.offline[user.user_id] = userValue;
                        }
                        if (req.body.user_id || user.acc_active === 0)
                            delete global.users[user.user_id];
                        else if (user.acc_active === 1)
                            global.users[user.user_id] = userValue;
                        res.json({
                            success: true,
                            message: 'User updated successfully!',
                            uid: user.user_id,
                            user: user
                        });
                    });

            }).catch(function(e) {
                res.status(500).send({
                    error: 'Error in updating user!'
                });
            });
        } else {
            res.status(500).send({
                error: 'You donot have permissions to edit!'
            });
        }
    });
    module.exports = router;

    return router;

};