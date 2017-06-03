export function geturl(payload) {
  //  console.log('payload');
  //  console.log(payload);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
}

export function getmainURL(payload) {
//  console.log('payload');
//  console.log(payload);
  return `https://www.google.com/maps/place/${payload.coordinates.lat},${payload.coordinates.long}/`
}

export function getEmojiURL(unicode) {
    return `https://cdn.jsdelivr.net/emojione/assets/png/${unicode}.png?v=2.2.7`;
}

export function isEmoji(str) {
    var ranges = [
        '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
        '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
        '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
    ];
    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    }
}


export function get_preview() {
  var detectedUrl = 'https://en.wikipedia.org/wiki/Artificial_neural_network'
  fetch(detectedUrl)
        .then(response => response.text())
        .then(text => { console.log(text)});
}

export function handleDate(d) {
    if(d){
        var c = new Date(Number(d));
        //alert(c)
        return c.getHours() + ':' + c.getMinutes()+ ' ' + c.toDateString();
    }
}

export function showDate(prev,next) {
  var p = new Date(Number(prev));
  var n = new Date(Number(next));

  if (n.getMinutes() - p.getMinutes() > 10 ||   n.getDay() != p.getDay() || n.getMonth() != p.getMonth() || n.getFullYear() != p.getFullYear()){
    return "true";
  }
  return "false";
}

export function handleAgentName(agents,senderid) {
  var agname = agents.filter((c) => c._id == senderid);
  if(agname.length > 0){
    return agname[0].firstname + ' ' + agname[0].lastname
  }
  else
  {
    console.log('undefined' + senderid);
    return 'undefined'
  }
}

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function displayDate(x) {
  var today = new Date();
  var n = new Date(Number(x))
  var days = ["SUN","MON","TUES","WED","THU","FRI","SAT"];
  var month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
  var s = '';
  if(today.getFullYear() == n.getFullYear()){
      if(today.getMonth() == n.getMonth()){
          if(today.getDay() == n.getDay()){
              s =  formatAMPM(n);
          }
          else{
            s = days[n.getDay()] + "," + formatAMPM(n);
          }
      }
      else{
        s =  days[n.getDay()] + ' ' + month[n.getMonth()]  + "," + formatAMPM(n)
      }
  }
  else{
    s =  days[n.getDay()] + ' ' + month[n.getMonth()] + n.getDay() +n.getFullYear() + "," + formatAMPM(n);
  }
 // alert(s);
  return s;
}

