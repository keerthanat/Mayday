'use strict';
var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');
var partials = require('express-partials');
var app = express();
var http = require('http').Server(app);

var ioSocket = require('socket.io')(http);
var io = ioSocket.of('/welcome');


module.exports = function(PORT, ROOT_DIR) {
    app.io = io;

    // view engine setup
    app.set('ROOT_DIR', ROOT_DIR);
    app.set('views', path.join(ROOT_DIR, 'views'));
    app.set('view engine', 'ejs');
    app.use(partials());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.all('*', function(req, res, next) {
//        console.log("global.env::" + global.env + "::" + req.originalUrl + "::" + req.originalUrl.indexOf('performance'));

        if (req.originalUrl.indexOf('performance') == -1 && global.env == 'test') {

            res.render('test', {
                message: "Performance Test Triggered",
                error: "Please wait! Performance Test has been triggered ",
                user: ""
            });
        } else {
            next();
        }
    });

    console.log("path.join(ROOT_DIR, 'public'" + path.join(ROOT_DIR, 'public'));
    app.use(express.static(path.join(ROOT_DIR, 'public')));
    var router = require('../routes')(app);
    var models = require('../models');

    global.users = {};
    global.online = {};
    global.offline = {};
    global.privileges = [];
    global.performanceUser = '';
    global.env = 'development';



var force = process.env.NODE_ENV == 'test';
//    var force = false;
    // RUN SERVER
    models.sequelize.sync({
        force: force
    })
            .then(function() {
                http.listen(PORT, function() {
                    console.log('server listening on port: ' + PORT);
                });
                if (force) {
                    models.PRIVILEGE.create({privilege: "CITIZEN", rule: "-"});
                    models.PRIVILEGE.create({privilege: "MONITOR", rule: "-performance-"});
                    models.PRIVILEGE.create({privilege: "CO-ORDINATOR", rule: "-announcement-"});
                    models.PRIVILEGE.create({privilege: "ADMIN", rule: "-announcement-performance-admin-"});
                    models.STATUS.create({status_id:0, status:"Not Available", statusClass:"info", statusMapClass:"blue",iconClass:"exclamation-circle"});
                    models.STATUS.create({status_id:1, status:"OK", statusClass:"success", statusMapClass:"green",iconClass:"check-circle"});
                    models.STATUS.create({status_id:2, status:"HELP", statusClass:"warning", statusMapClass:"yellow",iconClass:"hand-paper-o"});
                    models.STATUS.create({status_id:3, status:"EMERGENCY", statusClass:"danger", statusMapClass:"red",iconClass:"ambulance"});
                    
                    models.USERS.create({user_id: 'keert', password: 'hello', privilege: 4});
                    models.USERS.create({user_id: 'SSNAdmin', password: 'admin', privilege: 4, status:1});
                    models.USERS.create({user_id: 'coord', password: 'coord', privilege: 3});
                    models.USERS.create({user_id: 'monitor', password: 'monitor', privilege: 2}).then(function(user) {
                        addUsersAndPrivileges();
                    });



                } else {
                    addUsersAndPrivileges();
                }
                function addUsersAndPrivileges() {
                    models.USERS.findAll({where: { acc_active:1}})
                            .then(function(users) {
                                for (var i = 0; i < users.length; i++) {
                                    var user = users[i];
                                    global.users[user.user_id] = user;
                                    global.offline[user.user_id] = user;
                                }

                            }).catch(function(e) {
                    });


                    models.PRIVILEGE.findAll()
                            .then(function(privileges) {
                                for (var i = 0; i < privileges.length; i++) {
                                    var privilege = privileges[i];
                                    global.privileges[privilege.level_id] = privilege;
                                }

                            }).catch(function(e) {
                    });
                }
            });



  return http;




}