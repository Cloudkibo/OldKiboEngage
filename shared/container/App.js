import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateChatList} from '../redux/actions/actions';
import {printlogs} from '../services/clientlogging'; // todo print logs, use them in socket module

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.getSocketmessage = this.getSocketmessage.bind(this);
    this.state = {'connected':true}; // todo merge - let's make it depend on redux and not component state
  }

  componentDidMount() {
  }

  getSocketmessage(message) {
    this.props.updateChatList(message);
  }

  render() {
    return (

      <div>
      { /* make it use the connection information coming from redux through props and not internal state */ }
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
