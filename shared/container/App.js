import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateChatList } from '../redux/actions/actions';
import { notify } from '../services/notify';

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
      console.log('updateFBsessions desktop notify');
      console.log(data);
      if (data.status === 'assigned') {
        notify(`${data.username } of Facebook Page ${data.pageTitle} has been assigned to ${data.agentname}`);
      } else {
        notify(`${data.username} of Facebook Page ${data.pageTitle} has been resolved by ${data.agentname}`);
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
