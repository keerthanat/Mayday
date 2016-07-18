

    $('[data-toggle=offcanvas]').click(function() {
    $(this).toggleClass('visible-xs text-center');
    $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
    $('.row-offcanvas').toggleClass('active');
    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
    $('#chatPage').toggleClass('col-xs-10').toggleClass('col-xs-8');
    $('#btnShow').toggle();
});
    //Socket io script  
    var socket = io.connect(window.location.origin+'/welcome',{ query: "user="+ localStorage.getItem('mayday_userId')});
//
//    // var colorStack = {};;
//    socket.emit('user connected', {
//        uid: localStorage.getItem('mayday_userId') //localStorage.getItem('mayday_userId')
//    });
    socket.on('chat message', function(data) {
    var path =  $("#topNav ul li.active").attr('data-path');
    if(path.indexOf('publicchat') != -1){
      if(signInMsg < data.msg_id){
        if (lastMsgUid != "" && lastMsgUid == data.user_id) {
            $('#messages div').last().first().append('<span class="msg cmsg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span>');
        } else {
            lastMsgUid = data.user_id;
            var color = "";
            if (colorStack[data.user_id] != undefined) {
                color = colorStack[data.user_id];
            } else {
                color = getRandomColor();
                colorStack[data.user_id] = color;
            }

            var message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + data.user_id + '</span><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            if (localStorage.getItem('mayday_userId') == data.user_id) {
                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }
            $('#messages').append(message);
        }
        $('#messages').animate({
            scrollTop: $('#messages').prop("scrollHeight")
        }, 500);
      }
     }else{
        $("#alertMsg").html("New public message from "+data.user_id);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

        $("#success-alert").hide();
        }); 
     }
    });

    //display private chat message to sender and receiver
    socket.on('private chat message', function(data) {
        var path =  $("#topNav ul li.active").attr('data-path');
        if(path && path.indexOf('privatechat') != -1){
      if(data.sender == receiver || data.sender == localStorage.getItem('mayday_userId')){
        if (lastMsgUid != "" && lastMsgUid == data.sender) {
            $('#messages div').last().first().append('<span class="msg cmsg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span>');
        } else {
            var message;
            lastMsgUid = data.sender;
            var color = "";
            if (colorStack[data.sender] != undefined) {
                color = colorStack[data.sender];
            } else {
                color = getRandomColor();
                colorStack[data.sender] = color;
            }
            if (localStorage.getItem('mayday_userId') == data.sender) {
                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }else{
                message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + data.sender + '</span><span class="msg">' + decodeURIComponent(data.msg) + '</span><span class="mdate">' + new Date().toString('HH:mm') + '</span></div></div>';
            }
            
                $('#messages').append(message);
            } 
        $('#messages').animate({
            scrollTop: $('#messages').prop("scrollHeight")
        }, 500);
      }
      else {
                // Increase notification count of data.sender
                if(isNaN(unreadCount[data.sender])){
                    unreadCount[data.sender] = 0;
                    
                }               
                unreadCount[data.sender] = unreadCount[data.sender] +1;
                $('#xs-badge-'+data.sender).text(unreadCount[data.sender]);
                $('#badge-'+data.sender).text(unreadCount[data.sender]);
            }
           } else{
        $("#alertMsg").html("New private message from "+data.sender);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

        $("#success-alert").hide();
        }); 
     }
    });

    var getChatScrollUp = function(msgid) {
        $.get("/publicmessage/chatScrollUp/"+msgid, function(results) {
            //$('#messages').prepend($('<div>').attr('class', 'loading'));
            if(results.success){
                var data = results.messages;
                var delay = 1000; //1 seconds
                if ($('#messages div').length == 0) {
                    delay = 0;
                }
                setTimeout(function() {
                    //your code to be executed after 1 seconds

                    $('#messages').find('.loading').remove();
                    signInMsg -= data.length;
                    var firstMsgUid = "";

                    for (var i = 0; i < data.length; i++) {

                        var result = data[i];
                        var msgDate = Date.parseExact(result.time_id, "yyyy-MM-dd HH:mm:ss");
                        var ts = msgDate.toString('HH:mm');
                        msgDate = msgDate.set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                        });

                        if (timeStamp - msgDate > 0) {
                            $('#messages').prepend($('<div>').text(timeStamp.toString('yyyy-MM-dd')).attr('class', 'userLog'));
                            timeStamp = msgDate.clone();
                            firstMsgUid = "";
                        }
                        if (firstMsgUid != "" && firstMsgUid == result.user_id) {
                            if (localStorage.getItem('mayday_userId') == result.user_id) {
                                $('#messages div div').first().prepend('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
                            } else {
                                $('#messages div div span').first().after('<span class="msg cmsg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
                            }
                        } else {
                            firstMsgUid = result.user_id;
                            var color = "";
                            if (colorStack[result.user_id] != undefined) {
                                color = colorStack[result.user_id];
                            } else {
                                color = getRandomColor();
                                colorStack[result.user_id] = color;
                            }

                            var message = '<div><div class="message"><span class="uid" style="color:' + color + ';">' + result.user_id + '</span><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';

                            if (localStorage.getItem('mayday_userId') == result.user_id) {
                                message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span></div></div>';
                            }
                            $('#messages').prepend(message);
                        }
                    }
                }, delay);
                if (delay == 0) {
                    $('#messages').animate({
                        scrollTop: $('#messages').prop("scrollHeight") + 1000
                    }, 500);
                }
                //add to fetch announcements 
    //            socket.emit('fetch announcements');
                
        $.get("/announcement/getHistory", getHistoricAnnon);        
            }
            
        });
        }
   var getHistoricAnnon = function(data){
        for(i=0; i<data.announcements.length; i++){
            var admAnnouce = data.announcements[i].annon;
            var admName = data.announcements[i].user_id;
            var admDate = Date.parse(data.announcements[i].time_id);
            if(admAnnouce!="" && admName!="" && admDate !=""){
                var announcement = '<div><div class="announcement">[SYSTEM ANNOUNCEMENT]: ' + admAnnouce + '</div>';
                $('#messages').append(announcement);                    
            }
        }        
    }
    var getOnlineUserList = function() {
        $.get("/users/onlineUsers", function(data) {
            if (data.success) {
                $('#xs-menu').empty();
                $('#lg-menu').empty();
                $(".total").text("(" + (Object.keys(data.online).length - 1) + ")");
                for (var uid in data.online) {
                    // var client = data;
                    var color = "";
                    if (localStorage.getItem('mayday_userId') != uid) {
                        if (colorStack[uid] != undefined) {
                            color = colorStack[uid];
                        } else {
                            color = getRandomColor();
                            colorStack[uid] = color;
                        }
                        var path = $("#topNav ul li.active").attr('data-path');
                        if (path.indexOf('privatechat') != -1) {
                            var xsLi = '<li id="xs-' + uid + '" class="text-center" style="color:' + color + ';"><i class="fa fa-user"></i><div> <span class="badge" id="xs-badge-' + uid + '"></span></div></li>';
                            $('#xs-menu').append(xsLi);
                            var lgLi = '<li id="' + uid + '" style="color:' + color + ';"><i class="fa fa-user"></i><div> ' + uid + '  <span class="badge" id="badge-' + uid + '"></span></div></li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                            $('#lg-menu').append(lgLi);
                        }
                        else {
                            var xsLi = '<li id="xs-' + uid + '" class="text-center" style="color:' + color + ';"><i class="fa fa-user"></i></li>';
                            $('#xs-menu').append(xsLi);
                            var lgLi = '<li id="' + uid + '" style="color:' + color + ';"><i class="fa fa-user"></i> ' + uid + '</li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                            $('#lg-menu').append(lgLi);
                        }
                    }

                }
            }

        });
    };

    var getChatConnected = function(user){
        var path =  $("#topNav ul li.active").attr('data-path');
        $.get("/publicmessage/userConnected/"+user, function(data) {
                if(path.indexOf('privatechat') == -1){
                    $("#messages").empty();
    //                socket.emit('onlineUsersList');
                    getOnlineUserList();
                    signInMsg = data.msgid;
                    getChatScrollUp(data.msgid);
    //                socket.emit('chatScrollUp', {
    //                msgid: signInMsg
    //                });
                }else{
                    getOnlineUserList();
    //                socket.emit('onlineUsersList');
                }
            });
    }

    // Fetch private chat messages
   function didGetPrivateChatResult(data) {
        $("#messages").empty();
        var firstMsgUid = "";
        for (var i = 0; i < data.length; i++) {
            var result = data[i];
            var msgDate = Date.parseExact(result.time_id,"yyyy-MM-dd HH:mm:ss");
            var ts = msgDate.toString('HH:mm');
            msgDate = msgDate.set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                            });
           
            if(timeStamp-msgDate >0){
                $('#messages').prepend($('<div>').text(timeStamp.toString('yyyy-MM-dd')).attr('class', 'userLog'));
                timeStamp = msgDate.clone();
                firstMsgUid = "";
            }
            if (firstMsgUid != "" && firstMsgUid == result.sender) {
         //   console.log("result:"+ JSON.stringify(result));
                if (localStorage.getItem('mayday_userId') == result.sender) {
                    $('#messages div div').first().prepend('<span class="msg cmsg">' + 
                        decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
                }else{
                  $('#messages div div span').first().after('<span class="msg cmsg">' + 
                    decodeURIComponent(result.msg) + '</span><span class="mdate">' + ts + '</span>');
                }
                    $('#messages').scrollTop($('#messages')[0].scrollHeight);
            } else {
                firstMsgUid = result.sender;
                var color = "";
                
                if (colorStack[result.sender] != undefined) {
                    color = colorStack[result.sender];
                } else {
                    color = getRandomColor();
                    colorStack[result.sender] = color;
                }

                var message = '<div><div class="message"><span class="uid" style="color:' + color + 
                ';">' + result.sender + '</span><span class="msg">' + decodeURIComponent(result.msg) 
                + '</span><span class="mdate">' + ts + '</span></div></div>';


                if (localStorage.getItem('mayday_userId') == result.sender) {
                    message = '<div><div class="mymessage"><span class="msg">' + decodeURIComponent(result.msg) 
                    + '</span><span class="mdate">' + ts + '</span></div></div>';
                }
                $('#messages').prepend(message);
                $('#messages').scrollTop($('#messages')[0].scrollHeight);
            }           
        }  
    }

    socket.on('user connected', function(data) {

        var id = String(data.uid);
        var path =  $("#topNav ul li.active").attr('data-path');
        if(path && path.indexOf('chat') != -1){
        if (localStorage.getItem('mayday_userId') != data.uid && $("#"+data.uid).length == 0) {
            var client = data.uid;
            var color = "";
            if (colorStack[client] != undefined) {
                color = colorStack[client];
            } else {
                color = getRandomColor();
                colorStack[client] = color;
            }
            
            if(path.indexOf('privatechat') != -1){
                var xsLi = '<li id="xs-'+client+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i><div>  <span class="badge" id="xs-badge-'+client+'"></span></div></li>';
                $('#xs-menu').append(xsLi);
                var lgLi = '<li id="'+client+'" style="color:'+color+';"><i class="fa fa-user"></i><div> '+client+'  <span class="badge" id="badge-'+client+'"></span></div></li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                $('#lg-menu').append(lgLi);
            }else{
                 var xsLi = '<li id="xs-'+client+'" class="text-center" style="color:'+color+';"><i class="fa fa-user"></i></li>';
                $('#xs-menu').append(xsLi);
                var lgLi = '<li id="'+client+'" class="" style="color:'+color+';"><i class="fa fa-user"></i> '+client+'</li>'; //'<li id="'+data.uid+'">'+data.uid+'</li>';
                $('#lg-menu').append(lgLi);
                //$('#messages').append($('<div>').text(id + " joined").attr('class', 'userLog'));
                lastMsgUid = "";
            }
        } 

        $(".total").text("(" + (data.total - 1) + ")");
    }else if(data.uid != localStorage.getItem('mayday_userId')){
        $("#alertMsg").html("New user connected: "+data.uid);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

        $("#success-alert").hide();
        }); 
        if ($("#topNav ul li.active").attr('data-path') && $("#topNav ul li.active").attr('data-path').indexOf('users') != -1)
            $.get(localStorage.getItem('mayday_userId') + "/users", function(data) {
                $("#layoutChange div").remove();
                $("#layoutChange").html(data);
            });
    }

    });

    socket.on('user disconnected', function(data) {
        // alert("here")
        // $('#online_list').find('#' + data.uid).remove();
        var path =  $("#topNav ul li.active").attr('data-path');
        if(path && path.indexOf('chat') != -1){
        
        if(data.uid != localStorage.getItem('mayday_userId')){
            $('#xs-menu').find('#xs-' + data.uid).remove();
            $('#lg-menu').find('#' + data.uid).remove();;
                if(path.indexOf('privatechat') == -1){
                    // $('#messages').append($('<div>').text(data.uid + " left").attr('class', 'userLog'));
                    $('#messages').animate({
                        scrollTop: $('#messages').prop("scrollHeight") + 500
                }, 500);
            }else if(receiver == data.uid){
                var msgDiv='<div class="well" > <strong>User: '+receiver+' has left! </strong><i class="fa fa-comment"></i></div>'+
                      '<h5 style="padding-left: 10px;"> Click a <i class="fa fa-user"> name on the left to start chatting.... </i></h5>'+  
                      '<h5 style="padding-left: 10px;">All the messages sent will be private and only visible to the selected user. </h5>'+  
                      '<h5 style="padding-left: 10px;"> In case of unread chat messages, <i class="fa fa-bell"> you will be notified. </i> </h5>'+  
                '</div>';
                $('#messages').html(msgDiv);
                receiver = '';
                $('#sendChat').hide();
                $('#m').hide();
            }
            $(".total").text("(" + (data.total -1) + ")");
            lastMsgUid = "";
        }
    }else if(data.uid != localStorage.getItem('mayday_userId')){
        $("#alertMsg").html("User disconnected: "+data.uid);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

        $("#success-alert").hide();
        }); 
        if ($("#topNav ul li.active").attr('data-path') && $("#topNav ul li.active").attr('data-path').indexOf('users') != -1)
            $.get(localStorage.getItem('mayday_userId') + "/users", function(data) {
                $("#layoutChange div").remove();
                $("#layoutChange").html(data);
            });
    }
        

    });
    // socket.disconnect();
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        if (color.toString().toLowerCase().indexOf("fffff") == 1)
            getRandomColor();
        return color;
    }

    //
    socket.on('showAnnouncements', function(data){
    var path =  $("#topNav ul li.active").attr('data-path');
if(path.indexOf('chat') != -1){
        console.log('got socket');
        var admAnnouce = data.annon;
        var admName = data.user_id;
        var admDate = Date.parse(data.time_id);
        if(admAnnouce!="" && admName!="" && admDate !=""){
            var announcement = '<div><div class="announcement">[SYSTEM ANNOUNCEMENT]: ' + admAnnouce + '</div>';
            $('#messages').append(announcement);                    
            }
}else{
        $("#alertMsg").html("New Announcement: "+data.annon);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#success-alert").hide();
        }); 
}

    });
    socket.on("logout",function(data){
        var user = localStorage.removeItem('mayday_userId')+"";
        localStorage.removeItem('mayday_userId');
    window.location.href = "/";
    });
     socket.on('help request', function(data) {
        $("#reqUser").html(data.uid);
        $("#warning-alert").show();
     });

     socket.on('requestResponse', function(data) {
        $("#alertMsg").html(data.msg);
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

        $("#success-alert").hide();
        }); 
     });
    
        //socket.io.disconnect();
