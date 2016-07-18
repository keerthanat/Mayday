/*jslint node: true */
'use strict';
/* jshint shadow:true */
/*jshint sub:true*/

var express = require('express');
var router = express.Router();
var models = require('../models');

module.exports = function(io) {

  //get private messages between 2 users
  router.get('/messages/:sender/:receiver', function(req, res) {
    var sender = req.params.sender;
    var receiver = req.params.receiver;
    models.PRIVATE_MESSAGES.findAll({
      where: {
        sender: {
          $in: [req.params.sender, req.params.receiver]
        },
        receiver: {
          $in: [req.params.sender, req.params.receiver]
        }
      },
      order: 'msg_id DESC',
    }).then(function (msgs){
      res.status(200).json({
          success: true,
          message: 'Messages retrieved!',
          result: msgs
      });
    }).catch(function(e){
      res.status(404).end();
    });
  });

  //add a private message in db and emitting back to sender and receiver
  router.post('/message', function(req, res) {
    var data = req.body;
    models.PRIVATE_MESSAGES.create({
      sender: data.sender,
      receiver: data.receiver,
      msg: data.msg,
      time_id: data.time_id
    }).then(function() {
      for (var i = 0; i < io.sockets.length; i++) {
        var socket = io.sockets[i];
        var uid = socket.uid;
        if (uid !== undefined && uid !== "" && (uid == data.receiver || uid == data.sender)) {
          socket.emit('private chat message', data);
        }
      }
      res.status(200).json({
          success: true,
          message: 'Message sent!'
      });
    }).catch(function(e){
      res.status(404).end();
    });
  });

 //get private message by id
  router.get('/messages/:msg_id', function(req, res) {
    var msg_id = req.params.msg_id;
    models.PRIVATE_MESSAGES.findOne({
      where: {
        msg_id: msg_id
      },
    }).then(function (msg){
      res.status(200).json({
          success: true,
          message: 'Message by id retrieved!',
          result: msg
      });
    }).catch(function(e){
      res.status(404).end();
    });
  });
  
  router.get('/chatbuddies/:user_id', function(req, res) {
    models.PRIVATE_MESSAGES.findAll( { 
        attributes: ['receiver','sender'],
     distinct:true,
 
      where: {
          $or: {
            sender: req.params.user_id ,
            receiver: req.params.user_id
        }
    }}).then(function (result){
    var chatbuddies = ",";
    for(var i =0;i<result.length;i++){
        if(result[i].sender != req.params.user_id && chatbuddies.indexOf(","+result[i].sender +",")==-1){
            chatbuddies = chatbuddies+result[i].sender+",";
        }
        if(result[i].receiver != req.params.user_id && chatbuddies.indexOf(","+result[i].receiver +",") ==-1){
            chatbuddies = chatbuddies+ result[i].receiver+",";
        }
    }
    chatbuddies = chatbuddies.substring(1, chatbuddies.length-1);
      res.status(200).json({
          success: true,
          message: 'Message by id retrieved!',
          result: chatbuddies.split(",")
      });
    }).catch(function(e){
      res.status(404).end();
    });
  });

router.get('*', function(req, res) {
  res.status(404).end();
});

  return router;
};