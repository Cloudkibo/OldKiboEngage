import {printlogs} from '../../services/clientlogging';

export function getmetaurl(text){
   var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
   var onlyUrl =''
   if(text) {
     var testUrl = text.match(urlRegex);
     onlyUrl = testUrl && testUrl[0];
   }
   return onlyUrl;

}
export function geturl(payload) {
  // printlogs('log','payload');
  // printlogs('log',payload);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
}

export function getmainURL(payload) {
// printlogs('log','payload');
// printlogs('log',payload);
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
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;


  if (str.match(ranges.join('|')) || str.match(regex)) {
  // printlogs('log','isEmoji called returning true' + str)
    return true;
  } else {
    ////console.log('isEmoji called returning false' + str)
    return false;
  }
}


export function get_preview() {
  var detectedUrl = 'https://en.wikipedia.org/wiki/Artificial_neural_network'
  fetch(detectedUrl)
    .then(response => response.text())
    .then(text => {
     printlogs('log',text)
    });
}

export function handleDate(d) {
  if (d) {
    var c = new Date(Number(d));
    //alert(c)
    return c.getHours() + ':' + c.getMinutes() + ' ' + c.toDateString();
  }
}

export function showDate(prev, next) {
  var p = new Date(Number(prev));
  var n = new Date(Number(next));

  if (n.getMinutes() - p.getMinutes() > 10 || n.getDay() != p.getDay() || n.getMonth() != p.getMonth() || n.getFullYear() != p.getFullYear()) {
    return "true";
  }
  return "false";
}

export function handleAgentName(agents, senderid) {
  var agname = agents.filter((c) => c._id == senderid);
  if (agname.length > 0) {
    return agname[0].firstname + ' ' + agname[0].lastname
  }
  else {
   printlogs('log','undefined' + senderid);
    return 'undefined'
  }
}


export function showDateForChat(prev, next) {
  var p = new Date(prev);
  var n = new Date(next);

  if (n.getMinutes() - p.getMinutes() > 10 || n.getDay() != p.getDay() || n.getMonth() != p.getMonth() || n.getFullYear() != p.getFullYear()) {
    return "true";
  }
  return "false";
}


export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function displayDate(x) {
  var today = new Date();
  var n = new Date(Number(x))
  var days = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
  var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  var s = '';
  if (today.getFullYear() == n.getFullYear()) {
    if (today.getMonth() == n.getMonth()) {
      if (today.getDay() == n.getDay()) {
        s = formatAMPM(n);
      }
      else {
        s = days[n.getDay()] + "," + formatAMPM(n);
      }
    }
    else {
      s = days[n.getDay()] + ' ' + month[n.getMonth()] + "," + formatAMPM(n)
    }
  }
  else {
    s = days[n.getDay()] + ' ' + month[n.getMonth()] + n.getDay() + n.getFullYear() + "," + formatAMPM(n);
  }
  // alert(s);
  return s;
}


export function displayDateForChat(x) {
  var today = new Date();
  var n = new Date(x)
  var days = ["SUN", "MON", "TUES", "WED", "THU", "FRI", "SAT"];
  var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  var s = '';
  if (today.getFullYear() == n.getFullYear()) {
    if (today.getMonth() == n.getMonth()) {
      if (today.getDay() == n.getDay()) {
        s = formatAMPM(n);
      }
      else {
        s = days[n.getDay()] + "," + formatAMPM(n);
      }
    }
    else {
      s = days[n.getDay()] + ' ' + month[n.getMonth()] + "," + formatAMPM(n)
    }
  }
  else {
    s = days[n.getDay()] + ' ' + month[n.getMonth()] + n.getDay() + n.getFullYear() + "," + formatAMPM(n);
  }
  // alert(s);
  return s;
}
