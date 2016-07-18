$('.list-group-item').click(function(e){
  //console.log('searchOption '+searchOption);
  e.preventDefault(); 
  if($(e.target).prop("tagName") == "H3"){
  var topic = $(e.target).parent().attr('id');
      $.get("/firstaid/topic/" + topic, function(data) {
        console.log("got data" + data.result);
        $(".firstaid").html("");
        var symptoms = data.result[0].symptoms.replace(/,/g, "<br />");
        var steps = data.result[0].steps.replace(/\n/g, "<br />");
        var content = "<h4>Symptoms</h4><div>"+symptoms+"</div><h4>Steps</h4><div>"+steps+"</div>"
        $(e.target).parent().children().eq(1).html(content);
        $('.list-group-item').removeClass("active");
        $(e.target).parent().addClass("active");
        
      });  
      }  
    
    });
