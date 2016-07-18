/*jslint node: true */
'use strict';
/* jshint shadow:true */
/*jshint sub:true*/

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');


module.exports = function(io) {
    router.get('/wall', function(req, res) {
        models.MESSAGES.findAll()
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

    router.get('/userConnected/:user', function(req, res) {
        var user = req.params.user;
        var lmsgid = 0;
        models.MESSAGES.findOne({ order: 'msg_id DESC'})
                .then(function(message) {
                    global.online[user].lmsgid = message.msg_id;
                    lmsgid = message.msg_id;
                    res.json({
            success: true,
            msgid: lmsgid,
            total: Object.keys(global.online).length
        });
                }).catch(function(e) {
                    res.json({
            success: true,
            msgid: lmsgid,
            total: Object.keys(global.online).length
        });

        });
    });

    router.get('/chatScrollUp/:msgid', function(req, res) {
        var msg_id = parseInt(req.params.msgid);
        models.MESSAGES.findMessagesByLimit(models, {limit: 30, msg_id: msg_id}, function(messages) {
            res.json({
                success: true,
                messages: messages
            });
        });
    });

    router.post('/message', function(req, res) {
        models.MESSAGES.create(req.body)
                .then(function(message) {
                    io.emit('chat message', message);
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
    
    



    return router;

};