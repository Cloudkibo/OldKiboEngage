export function notify(message) {
  // Let's check if the browser supports notifications
  console.log('notify called');
  //console.log(window.location.host);
  if (!('Notification' in window)) {
    // alert("This browser does not support desktop notification");
  } else if (Notification.permission === 'granted') {
    // Let's check if the user is okay to get some notification

    // If it's okay let's create a notification
    var notification = new Notification('KiboEngage', {
      dir: 'auto',
      lang: '',
      body: message,
      icon: '/companyfiles/logo_small.png',
      tag: 'sometag',
    });
  }
  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {

        var notification = new Notification('KiboEngage', {
          dir: 'auto',
          lang: '',
          body: message,
          icon: '/companyfiles/logo_small.png',
          tag: 'sometag',
        });
      }
    });
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother them any more.
}
