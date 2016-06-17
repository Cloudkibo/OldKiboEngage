import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';

class Intro extends Component {
  render() {
    return (
      <div>
      <Header/>
      <div className="intro">

        <h1>Intro Page</h1>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/createcustomer/cd89f71715f2014725163952"> Add Customer</Link>



      </div>
      <Footer/>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Intro);
