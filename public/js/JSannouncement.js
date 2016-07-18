$('document').ready(function(){
    $.get("/announcement/getHistory", 
        function(data){
        // console.log(data[0].time_id);
        for(i=0; i<data.announcements.length; i++){
            var admAnnouce = data.announcements[i].annon;
            var admName = data.announcements[i].user_id;
            var msgDate = Date.parse(data.announcements[i].time_id);
            var ts = msgDate.toString("yyyy-MM-dd HH:mm");
            var announcement = '<div><div class="message"><stylepan class="msg">' + '<p>[ANNOUNCEMENT]: ' +admAnnouce + '</p></span><span class="uid" style="color: navbar-blue;">' + admName + '</span><span class="mdate">' + ts + '</span></div></div>';
            $('#announcements').append(announcement);
        }
    });
});

$('#sendAnnoucement').prop("disabled", true);
$('#m').on("keyup", action);

function action() {
    if ($('#m').val().length > 0) {
        $('#sendAnnoucement').prop("disabled", false);
    } else {
        $('#sendAnnoucement').prop("disabled", true);
    }
}

$('#announceBox').submit(function(event){
    var admName = localStorage.getItem('mayday_userId');
    var admAnnouce = $('#m').val();
    var admTime = new Date().toString("yyyy-MM-dd HH:mm:ss");
//    console.log({admName, admAnnouce, admTime});
    event.preventDefault();

    if(admAnnouce){
        var announcement = '<div><div class="message"><span class="msg">' + '<p>[ANNOUNCEMENT]: ' +admAnnouce + '</p></span><span class="uid" style="color: navbar-blue;">' + admName + '</span><span class="mdate">' + admTime.toString('HH:mm') + '</span></div></div>';
        $('#announcements').append(announcement);
        $('#m').val('');

        $.post("/announcement/publishAnnon", {
            user_id: admName,
            annon: admAnnouce, 
            time_id: admTime
        }, function(data){
            console.log(data);
        });
    }
});

