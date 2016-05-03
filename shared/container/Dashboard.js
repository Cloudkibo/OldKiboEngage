import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/AuthorizedHeader.jsx';
import Footer from '../components/Footer/Footer.jsx';
import auth from '../services/auth';
class Dashboard extends Component {

  render() {
    const token = auth.getToken()

    return (
      <div>
      <Header loggedin = "true" />
      <h1>Dashboard</h1>
      <p>You made it!</p>
      <p>{token}</p>
      </div>
  )
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Dashboard);
