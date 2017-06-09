import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateChatList} from '../redux/actions/actions';

class App extends Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
  }

  render() {
    return (

      <div>
      { /* make it use the connection information coming from redux through props and not internal state */ }
        {this.props.internalState.isSocketConnected === false &&
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
  return {
    internalState: (state.internalState),
  };
}

export default connect(mapStateToProps, {updateChatList})(App);
