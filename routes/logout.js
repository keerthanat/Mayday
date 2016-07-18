/*jslint node: true */
var express = require('express');
var router = express.Router();

module.exports = function(io) {
    /* Renew global arrays when a user logout */
    router.get('/:user', function(req, res, next) {
        var user = req.params.user;
        global.offline[user] = JSON.parse(JSON.stringify(global.online[user]));
        delete global.online[user];
        res.redirect('/');
    });
    return router;
};