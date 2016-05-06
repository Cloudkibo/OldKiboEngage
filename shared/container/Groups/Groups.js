import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {getusergroups} from '../../redux/actions/actions'
import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
class Groups extends Component {

 constructor(props, context) {
    super(props, context);
    
    
  }
  componentWillMount(){
    //call action to get user groups 
    const usertoken = auth.getToken();
     console.log('componentWillMount is called');
    if(usertoken != null)
    {
       
        console.log(usertoken);
        this.props.getusergroups(usertoken)
      }

  }
  render() {
    console.log(this.props.groupdetails)
    const token = auth.getToken()
    console.log(token)
    return (
      <div>
      <AuthorizedHeader isAuthenticated={auth.loggedIn()} />
       <div className="page-container">
          <SideBar/> 
          <div className="page-content-wrapper">
            <div className="page-content"> 
                <h1>Groups</h1>
                <p>You made it!</p>
                <p>My token {token}</p>
                {
                this.props.groupsdetails &&
                <p>Hello</p>
                }
            </div>
          </div>
       </div>
       </div> 
  )
  }
}



function mapStateToProps(state) {
  
  return {dashboard:(state.dashboard.groupsdetails) };
}

export default connect(mapStateToProps,{getusergroups })(Groups);
