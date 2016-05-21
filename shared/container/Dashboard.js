import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getuser} from '../redux/actions/actions'
import AuthorizedHeader from '../components/Header/AuthorizedHeader';
import Footer from '../components/Footer/Footer.jsx';
import SideBar from '../components/Header/SideBar';
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
    //console.log(this.props.userdetails)
    const token = auth.getToken()
    const username = this.props.userdetails.firstname
    console.log(username)
    return (
      <div>
        <AuthorizedHeader name = {this.props.userdetails.firstname} />
       <div className="page-container">
          <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
                <h1>Dashboard</h1>
                <p>You made it!</p>
                <p>My token {token} {this.props.userdetails.firstname}</p>
               
            </div>
          </div>
       </div>
       </div> 
  )
  }
}



function mapStateToProps(state) {
  
  return {userdetails:(state.dashboard.userdetails) };
}

export default connect(mapStateToProps,{getuser})(Dashboard);
