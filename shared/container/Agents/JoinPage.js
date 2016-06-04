import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import {getInviteEmail} from '../../redux/actions/actions'

class JoinPage extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  render() {
   // alert(this.props.param.id)
    return (
      <div>
      <Header/>
      <div className="intro">

        <h1>Join Page</h1>
        <Link to="/login">Login</Link>
        <Link to="joincompany/kn7xv497wrk920166413271"> joincompany </Link>
        <Link to="/dashboard">Dashboard</Link>

      </div>
      <Footer/>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {getInviteEmail })(JoinPage);
