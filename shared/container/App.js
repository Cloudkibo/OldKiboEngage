import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


function notifyMe(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  // Let's check if the user is okay to get some notification
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
 var notification = new Notification("KiboEngage", {
        dir: "auto",
        lang: "",
        body: message,
        tag: "sometag",
    });
  }
  // Otherwise, we need to ask the user for permission
  // Note, Chrome does not implement the permission static property
  // So we have to check for NOT 'denied' instead of 'default'
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // Whatever the user answers, we make sure we store the information
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
      // If the user is okay, let's create a notification
      if (permission === "granted") {

        var notification = new Notification("KiboEngage", {
        dir: "auto",
        lang: "",
        body: message,
        tag: "sometag",
    });
      }
    });
  }
  // At last, if the user already denied any notification, and you
  // want to be respectful there is no need to bother them any more.
}




class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.alertme = this.alertme.bind(this);

  }

  alertme(data){
    notifyMe('customer joined a session');

  }
  componentDidMount(){

        this.props.route.socket.on('customer_joined',this.alertme);

}

  render() {
    return (

      <div>
        
        { this.props.children }

      </div>

    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
};

export default connect()(App);
