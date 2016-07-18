
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

    $('#sendChat').prop("disabled", true);


    //socket.io.reconnect();
    console.log("Calling user connected;");
    getChatConnected(localStorage.getItem('mayday_userId'));
   // socket.emit('user connected', {
   //     uid: localStorage.getItem('mayday_userId') //localStorage.getItem('mayday_userId')
    //});
    $('#m').focus();
    $('#m').on("keyup", action);

    function action() {
        if ($('#m').val().length > 0 && $('#m').val().trim().length > 0) {
            $('#sendChat').prop("disabled", false);
        } else {
            $('#sendChat').prop("disabled", true);
        }
    }



    $('#chatBox').submit(function() {
        $.post("/publicmessage/message/",{
            user_id: localStorage.getItem('mayday_userId'),
            msg: $('#m').val(),
            time_id: new Date().toString("yyyy-MM-dd HH:mm:ss")
        }, function(data) {
        });
        $('#m').val('');
        return false;
    });



    var lastScrollTop = 0;

    $('#messages').scroll(function(event) {
        var st = $(this).scrollTop();
        if (st <= lastScrollTop && signInMsg > 0 && $('#messages').find('.loading')) {

            $('#messages').prepend($('<div>').attr('class', 'loading').append('<i class="fa fa-cog fa-spin fa-2x fa-fw margin-bottom"></i>'));
            // upscroll code
            getChatScrollUp(signInMsg);

        }
        // lastScrollTop = st;
    });

