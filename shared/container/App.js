import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateChatList } from '../redux/actions/actions';
import { notify } from '../services/notify';

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
        icon: "https://kiboengage.kibosupport.com/companyfiles/logo_small.png",
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
    this.getSocketmessage = this.getSocketmessage.bind(this);
  }

  componentDidMount () {
    this.props.route.socket.on('customer_joined', this.alertme);
    this.props.route.socket.on('send:fbcustomer', (data) => {
      notify('facebook customer joined');
    });
    this.props.route.socket.on('updateFBsessions', (data) => {
      if (data.status === 'assigned') {
        notify(`${data.user_id.first_name } ${data.user_id.last_name} of Facebook Page ${data.pageid.pageTitle} has been assigned.`);
      } else {
        notify(`${data.user_id.first_name } ${data.user_id.last_name} of Facebook Page ${data.pageid.pageTitle} has been resolved.`);
      }
    });
  }

  getSocketmessage(message){
    this.props.updateChatList(message);
  }

  alertme(data) {
    notify('customer joined a session');
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

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps,{updateChatList})(App);
