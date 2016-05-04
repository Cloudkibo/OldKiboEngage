import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import AuthorizedHeader from '../components/Header/AuthorizedHeader.jsx';
import Footer from '../components/Footer/Footer.jsx';
import auth from '../services/auth';
class Dashboard extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  componentWillMount(){
    //call action to get username 
    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    console.log(usertoken);
    this.props.getuser(usertoken)

  }
  render() {
    console.log(this.props.userdetails)
    const token = auth.getToken()
    const username = JSON.parse(this.props.userdetails).firstname
    return (
      <div>
      <AuthorizedHeader loggedin = {username} isAuthenticated={auth.loggedIn()} />
      <h1>Dashboard</h1>
      <p>You made it!</p>
      <p>My token {token}</p>
      {
      this.props.userdetails &&
      <p>Hello {JSON.parse(this.props.userdetails).firstname}</p>
      }
      </div>
  )
  }
}



function mapStateToProps(state) {
  
  return {userdetails:(state.dashboard.userdetails.user) };
}

export default connect(mapStateToProps,{ getuser })(Dashboard);
