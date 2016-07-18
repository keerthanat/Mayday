/*jslint node: true */
'use strict';
/* jshint shadow:true */
/*jshint sub:true*/

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');
var status = {},statusClass = {},statusMapClass = {},iconClass = {};
module.exports = function(io) {
    models.STATUS.findAll( ).then(function (result){
    for(var i =0;i<result.length;i++){
        status[result[i].status_id+""]=result[i].status;
        statusClass[result[i].status_id+""]=result[i].statusClass;
        statusMapClass[result[i].status_id+""]=result[i].statusMapClass;
        iconClass[result[i].status_id+""]=result[i].iconClass;
    }

    }).catch(function(e){
    });
    
/* render welcome page. */

io.on("connection", function(socket) {
            if(global.online[socket.handshake.query.user] !== null && global.online[socket.handshake.query.user]){
             if(io.sockets){
                socket['uid'] = socket.handshake.query.user+"";                   
                var data = {};
                data.uid = socket.handshake.query.user;
                var client = {};
                for (var i = 0; i < io.sockets.length; i++) {
                    var uid = io.sockets[i].uid;
                    if (uid !== undefined && uid !== "")
                        client[uid] = 1;
                }
                data.total = Object.keys(client).length;
                io.emit('user connected', data);
              }
          } else {
                  socket.emit('logout');
              }

            socket.on('disconnect', function() {
                if (socket['uid'] !== undefined) {
                var data = {};
                data.uid = socket.uid + "";
                socket.uid = "";
                var online = {};
                if(io.sockets){
                for (var i = 0; i < io.sockets.length; i++) {

                if (io.sockets[i].uid !== undefined && io.sockets[i].uid !== "") {
                  online[io.sockets[i].uid] = global.online[io.sockets[i].uid];

                }
              }
          }
              data['online'] = online;
              data.total = Object.keys(online).length;
              io.emit('user disconnected', data);
          }
            });
        });

router.get('/:user', function(req, res, next) {
    if (req.params.user && (global.online[req.params.user] !== null && global.online[req.params.user])) {
        //send back user/status data for "users" tag usage
        
        res.render('welcome', {
            user: req.params.user,
            u_status: global.online[req.params.user].status,
            privileges: global.privileges,
            u_privilege: global.online[req.params.user].privilege
        });
    } else {
        res.render("error", {
            error: 'Session expired',
            message: 'Please log out and log in again',
            user: ""
        });
    }
});

/*processes to check session*/
router.get('/:user/:nav', function(req, res, next) {
    var decoded = jwt.decode(req.get('x-user-token'), "mayday");
    // make sure the token not is expired and username is correct
    if (decoded.exp <= Date.now() || decoded.iss != req.params.user) {
        res.render("error", {
            error: 'Session expired',
            message: 'Please log out and log in again',
            user: req.params.user
        });
    }
    if (global.online[req.params.user] === null || global.online[req.params.user] === undefined)
        global.online[decoded.iss] = global.offline[decoded.iss] + "";
    delete global.offline[decoded.iss];

    var users = {
        "online": global.online,
        "offline": global.offline
    };
    

    var user1 = decoded.iss;
    var lat1 = users.online[user1].lat;
    var lon1 = users.online[user1].long;
    var disOnline = {};
    var disOffline = {};
    for (var user2 in users.online) {
        if (user1 != user2) {
            var lat2 = users.online[user2].lat;
            var lon2 = users.online[user2].long;
            disOnline[user2] = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
        }
    }
    for (var user2 in users.offline) {
        if (user1 != user2) {
            var lat2 = users.offline[user2].lat;
            var lon2 = users.offline[user2].long;
            disOffline[user2] = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
        }
    }
    var disOnlineSortedKeys = Object.keys(disOnline).sort(function(a, b) {
        return disOnline[a] - disOnline[b];
    });
    disOnlineSortedKeys.push(user1);
    disOnline[user1] = lat1 + "," + lon1;
    var disOfflineSortedKeys = Object.keys(disOffline).sort(function(a, b) {
        return disOffline[a] - disOffline[b];
    });
    if (req.params.nav != 'firstaid' && req.params.nav != 'admin') {
        res.render('partials/' + req.params.nav, {
            user: decoded.iss,
            users: users,
            u_status: global.online[req.params.user].status,
            status: status,
            statusClass: statusClass,
            statusMapClass: statusMapClass,
            iconClass: iconClass,
            disOnline: disOnline,
            disOffline: disOffline,
            disOnlineSortedKeys: disOnlineSortedKeys,
            disOfflineSortedKeys: disOfflineSortedKeys
        });
    } else if( req.params.nav == 'firstaid'){
        var result = [];
        
        models.FIRST_AID.findAll()
                .then(function(first_aid) {
                    res.render('partials/firstaid', {
                hasError: false,
                paginate: true,
                result: first_aid
            });
                }).catch(function(e) {
            res.render('partials/firstaid', {
                hasError: true,
                error: 'No results found!'
            });
        });
    }else if( req.params.nav == 'admin'){
        var result = [];
        
        models.USERS.findAll()
                .then(function(users) {
                    res.render('partials/admin', {
                users:users,
                statusClass: statusClass,
                acc_active:["Inactive","Active"],
                privileges: global.privileges
            });
                }).catch(function(e) {
        });
    }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; 
    var dLat = deg2rad(lat2 - lat1);  
    var dLon = deg2rad(lon2 - lon1);
    var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Distance in km
    // distance[user2] = d;
    return Math.floor(d);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}



    return router;

};