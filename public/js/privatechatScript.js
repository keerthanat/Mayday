
    $('[data-toggle=offcanvas]').click(function() {
        $(this).toggleClass('visible-xs text-center');
        $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
        $('.row-offcanvas').toggleClass('active');
        $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
        $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
        $('#chatPage').toggleClass('col-xs-10').toggleClass('col-xs-8');
        $('#btnShow').toggle();
    });

    var colorStack = {};
    var lastMsgUid = "";
    var signInMsg = 0;
    var timeStamp = Date.today().set({
                            second: 00,
                            minute: 00,
                            hour: 00,
                            })  ;
    var receiver ='';
    var unreadCount = {};
    $('#sendChat').prop("disabled", true);

    console.log("Calling user connected;");

    getChatConnected(localStorage.getItem('mayday_userId'));

    $('#m').hide();
    $('#sendChat').hide();
    $('#m').on("keyup", action);

    function action() {
        if ($('#m').val().length > 0 && $('#m').val().trim().length > 0) {
            $('#sendChat').prop("disabled", false);
        } else {
            $('#sendChat').prop("disabled", true);
        }
    }

    $("#lg-menu").click(function(e) {
        if($(e.target).parent().prop("tagName") == "LI" && !$(e.target).parent().hasClass("receiver")){
                $('#m').show();
                $('#sendChat').show();
                $('#m').focus();
                lastMsgUid = "";   
                receiver = $(e.target).parent().attr('id');
                unreadCount[receiver]=0;

                $('#xs-badge-'+receiver).html("");
                $('#badge-'+receiver).html("");
                var sender = localStorage.getItem('mayday_userId');
                $("#lg-menu li").removeClass("receiver");
                $("#xs-menu li").removeClass("receiver");
                $(e.target).parent().addClass("receiver");
                $("#xs-"+receiver).addClass("receiver");

            $.get("/privatemessage/messages/" + sender + "/" + receiver, function(data) {
                if(data.success) {
                    didGetPrivateChatResult(data.result);
                } else {
                    console.log("Error setting status!");
                }
            }).fail(function(err) {
                console.log(err.responseJSON.error);
            });
        }
    });

    $("#xs-menu").click(function(e) {
        if($(e.target).parent().prop("tagName") == "LI" && !$(e.target).parent().hasClass("receiver")){
            $('#m').show();
            $('#sendChat').show();
            $('#m').focus();
            lastMsgUid = "";
            
            
            receiver = $(e.target).parent().attr('id').toString().substring(3);
            unreadCount[receiver]=0;
            var sender = localStorage.getItem('mayday_userId');
            $('#xs-badge-'+receiver).html("");
            $('#badge-'+receiver).html("");
            $("#lg-menu li").removeClass("receiver");
            $("#xs-menu li").removeClass("receiver");
            $("#"+receiver).addClass("receiver");
            $("#xs-"+receiver).addClass("receiver");

            $.get("/privatemessage/messages/" + sender + "/" + receiver, function(data) {
                if(data.success) {
                    didGetPrivateChatResult(data.result);
                } else {
                    console.log("Error setting status!");
                }
            }).fail(function(err) {
                console.log(err.responseJSON.error);
            });      
        }
    });

    $('#chatBox').submit(function() {
        var sender = localStorage.getItem('mayday_userId');
        $.post("/privatemessage/message", {
            sender: sender,
            receiver: receiver,
            msg: $('#m').val(),
            time_id: new Date().toString("yyyy-MM-dd HH:mm:ss")
        }, function(data) {
            if(data.success) {
                console.log("Message sent successfully!");
            } else {
                console.log("Error setting status!");
            }
        }).fail(function(err) {
            console.log(err.responseJSON.error);
        });
        
        $('#m').val('');
        return false;
    });


