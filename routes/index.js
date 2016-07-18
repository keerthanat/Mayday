/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();

module.exports = function(app) {

    var login = require('./login')(app.io);
    var logout = require('./logout')(app.io);

    var welcome = require('./welcome')(app.io);
    var announcement = require('./announcement')(app.io);
    var users = require('./users')(app.io);
    var performance = require('./performance');
    var search = require('./search');
    var admin = require('./admin')(app.io);
    var firstaid = require('./firstaid');
    var publicmessage = require('./publicmessage')(app.io);
    var privatemessage = require('./privatemessage')(app.io);


    app.use('/', login);
    app.use('/welcome', welcome);
    app.use('/logout', logout);
    app.use('/announcement', announcement);
    app.use('/users', users);
    app.use('/performance', performance);
    app.use('/search', search);
    app.use('/admin', admin);
    app.use('/firstaid', firstaid);
    app.use('/publicmessage', publicmessage);
    app.use('/privatemessage', privatemessage);


    /*catch 404 and forward to error handler*/
    app.use(function(req, res, next) {
        var err = new Error('Link not found');
        err.status = 404;
        next(err);
    });


    /*error handlers*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            user: ""
        });
    });

    app.all('*', function(req, res, next) {
        if (req.originalUrl.indexOf('performance') === -1 && global.env === 'test') {

            res.render('test', {
                message: "Performance Test Triggered",
                error: "Please wait! Performance Test has been triggered ",
                user: ""
            });
        } else {
            next();
        }
    });

    /*production error handler*/
    /*no stacktraces leaked to user*/
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: "User not found",
            user: ""
        });
    });

    return router;
};