/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var models = require('../models');

module.exports = function(io) {
/*insert the announcement into database when an administrator announces something*/
    router.post('/publishAnnon', function(req, res) {
        models.ANNOUNCEMENTS.create(req.body)
            .then(function(announcements) {
                io.emit('showAnnouncements', announcements);
                res.status(201).json({
                    success: true,
                    message: 'Announcement stored!',
                });
            }).catch(function() {
                res.status(500).send({
                    error: 'Announcement could not be stored!'
                });
            });
    });

    /*fetch all historic announcemnets once a user enters announcements tag*/
    router.get('/getHistory', function(req, res) {
        models.ANNOUNCEMENTS.findAll()
            .then(function(announcements) {
                res.status(201).json({
                    success: true,
                    message: 'Get historic announcements',
                    announcements: announcements,
                });
            }).catch(function() {
                res.status(500).send({
                    error: 'Unable to fetch historic announcements!'
                });
            });
    });


    return router;
};