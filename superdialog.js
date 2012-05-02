/*
 Script Name: superDialog
 Author: Shamim Hasnath
 Author URI: http://hasnath.net
 Author Emai: shamim@hasnath.net
 Description: A lightweight Modal Dialog plugin for jquery
 License: GPL
*/
(function($) {
  
  var settings;
  var defaults = {
    overlay: true,
    method: 'GET',
    minimize: false,
    minimizeleft: 100,
    minimizebottom: 20
  };

  var unikcls = '';
  
  var doch, winh, winw;
  
   var overlay = 'jsdoverlay', cont = 'jsdcontent', container = 'jsdcontainer',
      loading = 'jsdloading', closebtn = 'jsdcbutton',
      overlayId = '.jsdoverlay', containerId = '.jsdcontainer';
  
  //Plugin starts
  $.fn.superDialog = function(options) {      
      settings = $.extend(defaults, options);
      var trig = this.is('form') ? "submit" : "click";
      
      doch= $(document).height();
      winh = $(window).height();
      winw = $(window).width();
    
    $("body").on(trig, this.selector, function(e){
        e.preventDefault();
        var $this = $(this);
        
        
        var rand = Math.floor(Math.random()*10000);       
        unikcls = 'jsdxcontainer'+rand;
        
        showLoading();
        
        if($this.is('a')){
            var url = $this.attr('href');
            if(url == '#'){
              var hiddo =  $($this.attr('rel')).clone().show();
              showDialog(hiddo);
            }else {
              ajaxReq(url, settings.method);
            }
        }else if($this.is('form')){
          ajaxReq($this.attr('action'), $this.attr('method'), $this.serialize());         
        }        
        //return false;
    });
  };
  
    
  var ajaxReq = function(url, method, data) {
        jQuery.ajax({
          type: (typeof method == 'undefined') ? 'GET': method,
          url: url,
          data: data,
          dataType: 'html',
          success: showDialog
        });
    };
  
  var showDialog = function(content){
        $(containerId).removeClass(loading);
        

       $("<div/>").addClass(cont).html(content).appendTo("."+unikcls);
        
        var w = $("."+unikcls).width();
        var h = $("."+unikcls).height();
        var pos = getpos(w, h);
       
        $("<div/>").addClass(closebtn).appendTo(containerId);
         if(settings.minimize == true){
              $("<div/>").addClass('jsdmbutton').appendTo(containerId);
        }
       $("."+unikcls).css({width: 60, height: 60})
       .animate({width: w + 'px', height: h+'px', left: pos[0]+'px', top: pos[1] + 'px'}, 100);
       
       //close button      
        $("."+closebtn).click(function(){
            $(overlayId).remove();
            $(this).parent().remove();
        });
        
        
        if(settings.minimize == false) return; // don't go farther if minimize is off
	
        //minimize button
        $(".jsdmbutton").click(function(){
          
          var koy = $(this).parent().attr('role');
          var wok = winh - settings.minimizebottom;
          var lef = getFreeSpace(wok);
          if(lef==  -1) alert("Sorry! Overflow!"); else {
                $('<div/>').addClass('jsdminimized').attr('role', koy).css({left: pos[0]+'px', top: pos[1] + 'px'})
                .show().appendTo(document.body).animate({left: lef+'px', top: wok+'px'}, 200);
                $(this).parent().hide();
          }
        });
        
        $('body').on("click", ".jsdminimized", function(){
          var clsp = $(this).attr('role');
          $('.'+clsp).show();
          $(this).remove();
        });
    } //plugin
  
  var showLoading = function(){
    
    var pos = getpos(60, 60);
    if(settings.minimize==false){
    $(overlayId+", ."+container).remove(); // remove previous instances
    }
    if(settings.overlay==true && settings.minimize==false){
        $("<div/>").addClass(overlay)
        .css('height', doch).appendTo(document.body);   //create overlay
    }
    $("<div/>").addClass(container+" "+loading+" "+unikcls).attr('role', unikcls)
    .css({left: pos[0]+'px', top: pos[1]+'px'}).appendTo(document.body); //container & loading
    //close
    if(!settings.minimize){
      $(overlayId).click(function(){ $(overlayId+", "+containerId).remove(); });
    }
  }
  
  var getpos = function(w, h){
    return [winw/2 - w/2,  winh/2 - h/2];
  }
  
 var getFreeSpace = function(h){
    var st = settings.minimizeleft, ele, cls;
    var cond = winw-70;
    for(; st<cond; st+=70){
        ele = document.elementFromPoint(st, h);
	cls = ele.className.replace(/\s/, ".");
        if(!(cls.length > 1))
        return st;
    }    
    return -1;
  }
 
})( jQuery );