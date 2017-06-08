import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateChatList} from '../redux/actions/actions';
import {notify} from '../services/notify';
import {printlogs} from '../services/clientlogging';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.alertme = this.alertme.bind(this);
    this.getSocketmessage = this.getSocketmessage.bind(this);
    this.state = {'connected':true};
  }

  componentDidMount() {

    this.props.route.socket.on('customer_joined', this.alertme);
    this.props.route.socket.on('send:fbcustomer', (data) => {
      notify('facebook customer joined');
    });
    this.props.route.socket.on('disconnect', () => {
        printlogs('log','disconnecting');  
        this.setState({'connected':false});
       // location.reload();
      });

     this.props.route.socket.on('connect', () => {
        printlogs('log','connecting');  
        this.setState({'connected':true});
       // location.reload();
      });

    this.props.route.socket.on('updateFBsessions', (data) => {
      printlogs('log','updateFBsessions desktop notify');
      printlogs('log',data);
      if (data.status === 'assigned') {
        notify(`${data.username } of Facebook Page ${data.pageTitle} has been assigned to ${data.agentname}`);
      } else {
        notify(`${data.username} of Facebook Page ${data.pageTitle} has been resolved by ${data.agentname}`);
      }
    });
  }

  getSocketmessage(message) {
    this.props.updateChatList(message);
  }

  alertme(data) {
    notify('customer joined a session');
  }

  render() {
    return (

      <div>
        {this.state.connected == false &&
          <div style={{
                background: '#F44336',
                width: '100%',
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 999,
              
          }}> You are disconnected. We will keep trying to reconnect or you can Refresh web page... </div>
        }
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

export default connect(mapStateToProps, {updateChatList})(App);
