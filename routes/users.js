/*jslint node: true */
'use strict';
/* jshint shadow:true */
/*jshint sub:true*/
/*global user*/

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');


module.exports = function(io) {
    router.get('/', function(req, res, next) {
      res.render('partials/users');
    });
    router.get('/onlineUsers', function(req, res) {
        var online = {};
        for (var i = 0; i < io.sockets.length; i++) {

            if (io.sockets[i].uid !== undefined && io.sockets[i].uid !== "") {
                online[io.sockets[i].uid] = global.online[io.sockets[i].uid];
            }
        }
        res.status(200).json({
        success: true,
        message: 'Fetched Online User List!',
        online: online
    });
    });
    
        router.get('/users', function(req, res, next) {

    res.status(200).json({
        success: true,
        message: 'Fetched User List!',
        users: global.users,
        online: global.online,
        offline: global.offline
    });
});

router.get('/logout/:user', function(req, res, next) {

    global.offline[user] = JSON.parse(JSON.stringify(global.online[user]));
    delete global.online[user];
    delete global.idle[user];
    res.status(200).json({
        success: true,
        message: 'Logged out!',
        user: user,
        value: global.users[user]
    });
});

router.get('/user/:user', function(req, res, next) {
    // res.json(global.users);
    var user = req.params.user;
    res.status(200).json({
        success: true,
        message: 'Fetched a Single User!',
        user: user,
        value: global.users[user]
    });
});



router.put('/updateUser/:uid', function(req, res) {
    var uid = req.params.uid;
    var columns = Object.keys(req.body);
    var columnsString = ","+columns.toString()+",";
    if(columnsString.indexOf('user_id') == -1 && columnsString.indexOf('password') == -1 && columnsString.indexOf('acc_active')==-1){
    models.USERS.update(
            req.body,
    {where: {user_id: uid}} 
    ).then(function(user) {
        var uid = req.body.user_id ? req.body.user_id : req.params.uid;
        models.USERS.findOne({where: {user_id:uid }})
            .then(function(user) {
        var userValue = user;
        if(global.online[user.user_id] !== null && global.online[user.user_id]){
            if(req.body.user_id)
            delete global.online[user.user_id];
            global.online[user.user_id] = userValue;
        }else{
            if(req.body.user_id)
            delete global.offline[user.user_id];
            global.offline[user.user_id] = userValue;
        }
        if(req.body.user_id)
            delete global.users[user.user_id];
        global.users[user.user_id] = userValue;
        
        res.json({
            success: true,
            message: 'User updated successfully!',
            uid: uid,
            user: user
        });
            });

    }).catch(function(e) {
        res.status(500).send({
            error: 'Error in updating user!'
        });
    });
}else{
    res.status(500).send({
            error: 'Update only status and location info!'
        });
}
});


    router.get('/userConnected/:user', function(req, res) {
        var user = req.params.user;
        var lmsgid = 0;
        models.MESSAGES.findOne({limit: 1, order: 'msg_id DESC'})
                .then(function(message) {
                    global.online[user].lmsgid = message.msg_id;
                    lmsgid = message.msg_id;

                }).catch(function(e) {

        });
        res.json({
            success: true,
            msgid: lmsgid,
            total: Object.keys(global.online[user]).length
        });
    });
    router.get('/requestHelp/:helper/:uid', function(req, res) {
      for (var i = 0; i < io.sockets.length; i++) {
          var receiver_socket = io.sockets[i];
          var uid = receiver_socket.uid;
          if (uid !== undefined && uid !== "" && uid == req.params.helper) {
            receiver_socket.emit('help request', {uid:req.params.uid,helper:req.params.helper});
          }
        }
    });

    router.get('/reqResponse/:requester/:uid/:status', function(req, res) {
      for (var i = 0; i < io.sockets.length; i++) {
          var receiver_socket = io.sockets[i];
          var uid = receiver_socket.uid;
          if (uid !== undefined && uid !== "" && uid == req.params.requester) {
            var result ={};
            if(req.params.status === 0){
              result.msg = req.params.uid+": has rejected your request! Please try another user!";
            }else{
              result.msg = req.params.uid+": has accepted your request! The user is on the way.";
            }
            receiver_socket.emit('requestResponse', result);
          }
        }
    });




    return router;

};