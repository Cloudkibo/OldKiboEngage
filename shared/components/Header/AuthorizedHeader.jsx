import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
import {getuser} from '../../redux/actions/actions'
import { connect } from 'react-redux';
export default class AuthorizedHeader extends Component
{
  componentWillMount(){
    //call action to get username 
    const usertoken = auth.getToken();
    console.log('componentWillMount is called');
    console.log(usertoken);
    this.props.getuser(usertoken)

  }

  render()
  {
   const {isAuthenticated} = this.props
   const username = this.props.userdetails.firstname
   console.log(username)

    return (
    
      <div  className = "page-header navbar" >
        <div className="page-header-inner">
          <div className = "page-logo" >
              <a href = '/' >
                <h4> Kibo Support System </h4>
              </a>
             
          </div >
          <div className="top-menu">
            <ul  className ="nav navbar-nav pull-right">
              <li className="dropdown dropdown-user">
                <a  href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                  <span className ="username">
                       {username}
                  </span>
                  <i className="fa fa-angle-down"/>
                  </a>
              <ul className="dropdown-menu">
                  <li>
                    <a href="/myprofile">
                      <i className="fa fa-user"/>
                      My Profile
                    </a>
                  </li> 
                  <li>
                    <a href="/mymsg">
                      <i className="fa fa-envelope-o"/>
                      My Messages
                    </a>
                  </li> 
                  
                  <li>

                    <a href="/mypickedcalls">
                      <i className="fa fa-phone-square"/>
                       My Picked Calls
                    </a>
                  </li> 
                  <li>
                    <a href="/myscheduledcalls">
                      <i className="fa fa-phone-square"/>
                      My Scheduled Calls
                    </a>
                  </li>
                  <li>
                       <Logout/>
                  </li>    
                </ul>    
              </li>
            </ul>
          </div>
             
         
          
    </div >
    </div>

  );
  }
}
function mapStateToProps(state) {
  
  return {userdetails:(state.dashboard.userdetails) };
}

AuthorizedHeader.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
  
}


export default connect(mapStateToProps,{ getuser })(AuthorizedHeader);
