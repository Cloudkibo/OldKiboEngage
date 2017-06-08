import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {updateChatList} from '../redux/actions/actions';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.getSocketmessage = this.getSocketmessage.bind(this);
  }

  componentDidMount() {

  }

  getSocketmessage(message) {
    this.props.updateChatList(message);
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

export default connect(mapStateToProps, {updateChatList})(App);
