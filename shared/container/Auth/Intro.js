import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Header} from '../../components/Header/Header.jsx'
import {Footer} from '../../components/Footer/Footer.jsx'

class Intro extends Component {
  render() {
    return (
      <div className="intro">

        <h1>Intro Page</h1>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>

      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Intro);
