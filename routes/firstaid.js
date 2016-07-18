/*jslint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');

router.get('/', function(req, res) {
    //var searchTxt = req.param('searchTxt');
    var result = [];
    models.FIRST_AID.findAll()
        .then(function(first_aids) {
            result = first_aids;
            res.render('partials/firstaid', {
                hasError: false,
                paginate: true,
                result: result // Double check 
            });
        }).catch(function(e) {
            res.render('partials/firstaid', {
                hasError: false,
                paginate: true,
                result: result
            });
        });
});



router.get('/topic/:value', function(req, res) {
    var searchTxt = req.param('searchTxt');
    var value = req.params.value;
    var result = [];
    models.FIRST_AID.findAll({
        where: {
            topic: value
        }
    })
        .then(function(first_aids) {
            result = first_aids;
            res.status(200).json({
                success: true,
                message: 'Messages retrieved!',
                result: first_aids
            });
        }).catch(function(e) {
            res.status(404).send({
                error: 'No messages!'
            });
        });
});

//AF
router.post('/savefirstaid', function(req, res) {
    var topic = req.body.topic;
    var symptoms = req.body.symptoms;
    var steps = req.body.steps;

    models.FIRST_AID.create(req.body)
        .then(function(first_aid) {
            res.status(201).json({
                success: true,
                message: 'Saved!'
            });
        }).catch(function(e) {
            res.status(404).send({
                error: 'Error saving!'
            });
        });

});


module.exports = router;