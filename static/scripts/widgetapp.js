function loadKiboWidget(id_client){

  var fullURL = location.href;
  var OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER = true;
  if(fullURL.indexOf('#') > -1)
  {
    console.log('changing the #');
    fullURL = fullURL.replace('#','');
    console.log('changed url: '+ fullURL)
  }

  if(OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER)
    window.open('http://kiboengage.cloudapp.net/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','KiboEngage','width=475,height=595,resizable=yes');
  else
    
    window.open('http://kiboengage.cloudapp.net/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','width=475,height=595,resizable=yes');
}