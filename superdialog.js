/*
 Script Name: superDialog
 Author: Shamim Hasnath
 Author URI: http://hasnath.net
 Author Emai: shamim@hasnath.net
 Description: A lightweight Modal Dialog plugin for jquery
*/


(function($) {
  
  var settings;
  var defaults = {
    overlay: true,
    method: 'GET'
  };

   var overlay = 'jsdoverlay', cont = 'jsdcontent', container = 'jsdcontainer',
      loading = 'jsdoading', closebtn = 'jsdcbutton';
   var overlayId = '#jsdoverlay', containerId = '#jsdcontainer';
  
  var doch, winh, winw;
  
  $.fn.superDialog = function(options) {      
      settings = $.extend(defaults, options);
      var trigEvent = this.is('form') ? "submit" : "click";
      
      doch= $(document).height();
      winh = $(window).height();
      winw = $(window).width();
    
    $("body").on(trigEvent, this.selector, function(e){
        e.preventDefault();
        var $this = $(this);
        
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
        $("#"+cont).remove();
        
       $("<div/>").attr('id', cont).addClass(cont).html(content).appendTo(containerId);
        
        var w = $(containerId).width();
        var h = $(containerId).height();
        var pos = getpos(w, h);
        $("<div/>").addClass(closebtn).appendTo(containerId);
       $(containerId).css({width: 60, height: 60})
       .animate({width: w + 'px', height: h+'px', left: pos[0]+'px', top: pos[1] + 'px'}, 200);
       
       //close button      
        $("."+closebtn).click(function(){
            $(overlayId+", "+containerId).remove();
        });  
    }
  
  var showLoading = function(){
    var pos = getpos(60, 60);
    
    $(overlayId+", "+containerId).remove(); // remove previous instances
    if(settings.overlay){
        $("<div/>").attr('id', overlay).addClass(overlay)
        .css('height', doch).appendTo(document.body);   //create overlay
    }
    $("<div/>").attr('id', container).addClass(container+" "+loading)
    .css({left: pos[0]+'px', top: pos[1]+'px'}).appendTo(document.body); //container & loading
    //close
    $(overlayId).click(function(){ $(overlayId+", "+containerId).remove(); });  
  }
  
  var getpos = function(w, h){  
    return [winw/2 - w/2,  winh/2 - h/2 ];
  }
 
})( jQuery );