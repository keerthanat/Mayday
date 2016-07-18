/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');


var postCounter = 0;

router.post('/publicmessage', function(req, res) {
    var user = req.body.user;
    var msg = req.body.content;
    if (postCounter >= req.body.maxReq) {
        models.PERF_MESSAGES.destroy({
            where: {
                msg_id: {
                    gte: 0
                }
            }
        })
            .then(function(messages) {

            }).catch(function(e) {
            });

        postCounter = 0;


    }
    models.PERF_MESSAGES.create({
        msg: msg,
        user_id: user
    })
        .then(function(message) {
            postCounter++;
            res.status(201).json({
                success: true,
                public_message: message,
                message: 'Message posted!'
            });

        }).catch(function(e) {
            res.status(404).send({
                error: 'User does not exist!'
            });
        });
});

router.get('/messages/wall', function(req, res) {
    var result = [];
    models.PERF_MESSAGES.findAll()
        .then(function(messages) {
            res.json({
                success: true,
                message: 'Messages found!',
                result: messages
            });
        }).catch(function(e) {
            res.status(500).send({
                error: 'Error no messages found!'
            });
        });
});

router.get('/startTestEnv', function(req, res) {
    global.env = 'test';
    var force = true;
    postCounter = 0;
    models.PERF_MESSAGES.destroy({
        where: {
            msg_id: {
                gte: 0
            }
        }
    })
        .then(function(messages) {

        }).catch(function(e) {         
        });


    res.status(200).send({
        success: 'Test env set!'
    });
});

router.get('/stopTestEnv', function(req, res) {
    global.env = 'development';
    res.status(200).send({
        success: 'Test env unset!'
    });
});
module.exports = router;