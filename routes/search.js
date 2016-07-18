'use strict';
/* jshint shadow:true */
/*jshint sub:true*/
/*jslint node: true */

var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');
router.get('/', function(req, res, next) {
    res.render('search');
});
/* search announcements */
router.get('/announcements', function(req, res) {
    var searchTxt = req.param('searchTxt');
    //if usernames exists and password match, issue a token
    models.ANNOUNCEMENTS.findAll({
        where: {
            annon: {
                like: '%' + searchTxt + '%'
            }
        }
    }).then(function(result) {
        if(result.length === 0){
            res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
            
        }else{
        res.render('partials/search', {
            hasError: false,
            paginate: false,
            result: {
                "Announcement": result
            },
            header: {
                "annon": "Announcement",
                "user_id": "User",
                "time_id": "Time"
            }
        });
    }
        
    }).catch(function(e) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    });

});

/* search public messages */
router.get('/publicChat', function(req, res) {
    
    var searchTxt = req.param('searchTxt');
    //if usernames exists and password match, issue a token
    models.MESSAGES.findAll({
        where: {
            msg: {
                like: '%' + searchTxt + '%'
            }
        }
    }).then(function(result) {
         if(result.length === 0){
            res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
            
        }else{
        res.render('partials/search', {
            hasError: false,
            paginate: false,
            result: {
                "Public Chat": result
            },
            header: {
                "msg": "Message",
                "user_id": "Sender",
                "time_id": "Time"
            } 
        });
    }
    }).catch(function(e) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    });
});


/* search private messages */
router.get('/privateChat', function(req, res) {
    
    var searchTxt = req.param('searchTxt');
    //if usernames exists and password match, issue a token
    models.PRIVATE_MESSAGES.findAll({
        where: {
            msg: {
                like: '%' + searchTxt + '%'
            }
        }
    }).then(function(result) {

         if(result.length === 0){
            res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
            
        }else{
        res.render('partials/search', {
            hasError: false,
            paginate: false,
            result: {
                "Private Chat": result
            },
            header: {
                "msg": "Message",
                "user_id": "Sender",
                "receiver": "Receiver",
                "time_id": "Time"
            }  
        });
    }
        
    }).catch(function(e) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    });
});

router.get('/cName', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    var searchTxt = req.param('searchTxt');
    for (var user in global.online) {
        if (user.indexOf(searchTxt) != -1) {
            var userData = global.online[user];
            userData.user_id = user;

            resultOnline.push(userData);
        }
    }

    for (var user in global.offline) {
        if (user.indexOf(searchTxt) != -1) {
            var userData = global.offline[user];
            userData.user_id = user;

            resultOffline.push(userData);
        }
    }
    if (resultOnline.length === 0 && resultOffline.length === 0) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    } else {
        res.render('partials/search', {
            hasError: false,
            paginate: false,
            result: {
                "OnlineUsers": resultOnline,
                "OfflineUsers": resultOffline
            },
            header: {
                "user_id": "Users",
                "status": "Status",
                "time_id": "Time",
                "location": "Location"
            }
        });

    }
});

// search on status for online users
router.get('/cStatus', function(req, res) {
    var resultOnline = [];
    var resultOffline = [];
    /*var search = parseInt(req.body.searchTxt);*/
    var searchTxt = req.param('searchTxt');

    for (var user in global.online) {
        if (global.online[user]['status'] == searchTxt) {
            var userData = global.online[user];
            userData.user_id = user;

            resultOnline.push(userData);
        }
    }

    for (var user in global.offline) {
        if (global.offline[user]['status'] == searchTxt) {
            var userData = global.offline[user];
            userData.user_id = user;

            resultOffline.push(userData);
        }
    }

    console.log(resultOnline);
    console.log(resultOffline);
    //res.send(result);

    if ((resultOnline.length + resultOffline.length) === 0) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    } else {
        res.render('partials/search', {
            hasError: false,
            paginate: false,
            result: {
                "OnlineUsers": resultOnline,
                "OfflineUsers": resultOffline
            },
            header: {
                "user_id": "Users",
                "status": "Status",
                "time_id": "Time",
                "location": "Location"
            }
        });
    }
});


router.get('/firstaid', function(req, res) {
    var searchTxt = req.param('searchTxt');
    var msgid = req.param('msgid');
    var result = [];
    models.FIRST_AID.findAll({
        where: {
            $or: {
                topic: {
                like: '%' + searchTxt + '%'
            },
            symptoms: {
                like: '%' + searchTxt + '%'
            },
            steps: {
                like: '%' + searchTxt + '%'
            }}
        }
    }).then(function(first_aid) {
         if(first_aid.length === 0){
            res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
            
        }else{
        res.render('partials/firstaid', {
            hasError: false,
            paginate: true,
            result: first_aid 
        });}
    }).catch(function(e) {
        res.render('partials/search', {
            hasError: true,
            error: 'No results found!'
        });
    });

});

module.exports = router;