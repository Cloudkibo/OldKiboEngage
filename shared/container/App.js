import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

var socket;

class App extends Component {

  componentDidMount() {
    socket = io.connect('');
    socket.on('news', (data) => { console.log(data) });
  }

  constructor(props, context) {
    super(props, context);
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
