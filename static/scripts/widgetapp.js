function loadKiboEngageWidget(id_client){

  var fullURL = location.href;
  var OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER = true;
  if(fullURL.indexOf('#') > -1)
  {
    console.log('changing the #');
    fullURL = fullURL.replace('#','');
    console.log('changed url: '+ fullURL)
  }
 // window.open('http://localhost:8000/signup')
 window.open('https://kiboengage.kibosupport.com/livehelp/'+id_client+'/'+ document.title,'Client Widget','width=475,height=750,resizable=yes');
 /* if(OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER)
    window.open('localhost:8000/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','KiboEngage','width=475,height=595,resizable=yes');
  else

    window.open('localhost:8000/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','width=475,height=595,resizable=yes');
*/
}

function loadUserDoc(){

  var fullURL = location.href;
  var OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER = true;

 // window.open('http://localhost:8000/signup')
 window.open('http://localhost:8000/userDocumentation/MainPage','Client Widget','width=475,height=750,resizable=yes');
 /* if(OPEN_AS_WINDOW_OR_TAB_PLACEHOLDER)
    window.open('localhost:8000/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','KiboEngage','width=475,height=595,resizable=yes');
  else

    window.open('localhost:8000/livehelp?pathname='+ document.title+'&fullurl='+fullURL+'&id='+id_client+'&role=visitor','width=475,height=595,resizable=yes');
*/
}
