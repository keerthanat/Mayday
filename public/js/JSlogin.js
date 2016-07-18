	// $(document).ready(function(){
	$('#signup').click(function() {
		$("#signUpPwd").removeClass("demo");
		$("#loginBtn").hide();
		$("#signupBtn").show();
		$("#signup").hide();
		$("#login").show();
		$('#pass2').prop("required",true);
		$("#loginBtn").prop("disabled", true);
		// if (!$('#pass1').val() || $('#pass1').val() != $('#pass2').val()) {
		// 	$("#signupBtn").prop("disabled", true);
		// }
	});
$('#login').click(function() {
	$("#signUpPwd").addClass("demo");
	$("#loginBtn").show();
	$("#signupBtn").hide();
	$("#signup").show();
	$("#login").hide();
	$('#pass2').prop("required",false);
	$("#loginBtn").prop("disabled", false);
	$(':password').parent().removeClass("has-success");
	$(':password').parent().removeClass("has-error");


});
$('input').keyup(function(e){
	// if($('.alert').is(':visible'))
	var pass1 = $('#pass1');
	var pass2 = $('#pass2');
	if(e.which != 13)
		$(".alert").hide();
	if($('#signupBtn').is(':visible')) {
		if (pass1.val() !="" && pass1.val() == pass2.val()) {
			$(':password').parent().removeClass("has-error");
			$(':password').parent().addClass("has-success");
			$("#signupBtn").prop("disabled", false);
			if(e.which == 13)
			$("#signupBtn").click();

		}else{
			$(':password').parent().addClass("has-error");
			$(':password').parent().removeClass("has-success");
			$("#signupBtn").prop("disabled", true);
		}
	}

});
function checkUname(uid){
	var resIds = ['about','access','account','accounts','add','address','adm','admin','administration','adult','advertising','affiliate','affiliates','ajax','analytics','android','anon','anonymous','api','app','apps','archive','atom','auth','authentication','avatar','backup','banner','banners','bin','billing','blog','blogs','board','bot','bots','business','chat','cache','cadastro','calendar','campaign','careers','cgi','client','cliente','code','comercial','compare','config','connect','contact','contest','create','code','compras','css','dashboard','data','db','design','delete','demo','design','designer','dev','devel','dir','directory','doc','docs','domain','download','downloads','edit','editor','email','ecommerce','forum','forums','faq','favorite','feed','feedback','flog','follow','file','files','free','ftp','gadget','gadgets','games','guest','group','groups','help','home','homepage','host','hosting','hostname','html','http','httpd','https','hpg','info','information','image','img'];
    var resIds1= ['images','imap','index','invite','intranet','indice','ipad','iphone','irc','java','javascript','job','jobs','js','knowledgebase','log','login','logs','logout','list','lists','mail','mail1','mail2','mail3','mail4','mail5','mailer','mailing','mx','manager','marketing','master','me','media','message','microblog','microblogs','mine','mp3','msg','msn','mysql','messenger','mob','mobile','movie','movies','music','musicas','my','name','named','net','network','new','news','newsletter','nick','nickname','notes','noticias','ns','ns1','ns2','ns3','ns4','old','online','operator','order','orders','page','pager','pages','panel','password','perl','pic','pics','photo','photos','photoalbum','php','plugin','plugins','pop','pop3','post','postmaster','postfix','posts','profile','project','projects','promo','pub','public','python','random','register','registration','root','ruby','rss','sale','sales','sample','samples','script','scripts','secure','send','service','shop','sql','signup'];
    var resIds2 = ['signin','search','security','settings','setting','setup','site','sites','sitemap','smtp','soporte','ssh','stage','staging','start','subscribe','subdomain','suporte','support','stat','static','stats','status','store','stores','system','tablet','tablets','tech','telnet','test','test1','test2','test3','teste','tests','theme','themes','tmp','todo','task','tasks','tools','tv','talk','update','upload','url','user','username','usuario','usage','vendas','video','videos','visitor','win','ww','www','www1','www2','www3','www4','www5','www6','www7','wwww','wws','wwws','web','webmail','website','websites','webmaster','workshop','xxx','xpg','you','yourname','yourusername','yoursite','yourdomain'];
	for(var i=0;i<resIds.length;i++){
		if(resIds[i].localeCompare(uid) == 0){
			return true;
		}
		
	}
	for(var i=0;i<resIds1.length;i++){
		if(resIds1[i].localeCompare(uid) == 0){
			return true;
		}
		
	}
	for(var i=0;i<resIds2.length;i++){
		if(resIds2[i].localeCompare(uid) == 0){
			return true;
		}
		
	}
	return false;
}
$('#loginBtn').click(function() {
	if(checkUname($('#uname').val())){
		$(".alert").show();
		$('#error').html("This user name is restricted, try another!");
		return false;
	}
	if ($('form#loginForm')[0].checkValidity()) {
		$.post("/loginUser", $('form#loginForm :input[name!="confirmPassword"]').serialize(), function(data) {
			 if(data.success)           
			{
				localStorage.setItem('mayday_userId',data.user);
				localStorage.setItem('mayday_token',data.token);
				localStorage.setItem('mayday_token_expiry',data.expires);
				window.location.href = "/welcome/"+data.user;
			}else{
				$(".alert").show();
				$('#error').html("Error loggin in!")
			}
		}).fail(function(err) {
			$(".alert").show();
		    $('#error').html(err.responseJSON.error);
		});

		return false;
	}
	return true;
});

$('#signupBtn').click(function() {
	// method = method || "post"; // Set method to post by default if not specified.
	// $('form#loginForm').submit();
	if(checkUname($('#uname').val())){
		$(".alert").show();
		$('#error').html("This user name is restricted, try another!");
		return false;
	}
	if ($('form#loginForm')[0].checkValidity()) {
		$.post("/signupUser", $('form#loginForm :input[name!="confirmPassword"]').serialize(), function(data) {
			if(data.success)           
			{
				localStorage.setItem('mayday_userId',data.user);
				localStorage.setItem('mayday_token',data.token);
				localStorage.setItem('mayday_token_expiry',data.expires);
				window.location.href = "/welcome/"+data.user;
				// $.ajax({
				//     url: "/test",
				//     headers: {"X-Test-Header": "test-value"}
				// });
			}else{
				$(".alert").show();
				$('#error').html("Error signin in!")
			}
		}).fail(function(err) {
			$(".alert").show();
		    $('#error').html(err.responseJSON.error);
		});
		return false;
	}
	return true;

});
$( ".close" ).click(function( event ) {
  event.preventDefault();
  $( this ).parent().hide();
});
// 

    if (localStorage.getItem('mayday_userId') != null){
        window.location.href = "/welcome/"+localStorage.getItem('mayday_userId');
    } 
    // else {
    //     document.write('<input type="button" id='approve' value="approve" onclick="a()"/><input type="button" id='reject' value="reject" onclick="r()"/>')
    // }
