import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
export default class AuthorizedHeader extends Component
{

  render()
  {
   const {isAuthenticated ,loggedin} = this.props
    return (
    
      <div  className = "page-header navbar" >
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
                       {this.props.loggedin}
                  </span>
                  <i className="fa fa-angle-down"/>
                  </a>
              <ul className="dropdown-menu">
                  <li>
                    <a href="/myscheduledcalls">
                      <i className="fa fa-phone-square"/>
                      | My Scheduled Calls
                    </a>
                  </li> 
                  <li>
                    <a href="/myscheduledcalls">
                      <i className="fa fa-phone-square"/>
                      | My Scheduled Calls
                    </a>
                  </li> 
                  <li>
                    <a href="/myscheduledcalls">
                      <i className="fa fa-phone-square"/>
                      | My Scheduled Calls
                    </a>
                  </li>    
                </ul>    
              </li>
            </ul>
          </div>
          <div>
           {isAuthenticated &&
                <Logout/>
              }
          </div>       
          <p>You are loggedin {this.props.loggedin}</p>
             
    </div >
    

  );
  }
}

AuthorizedHeader.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
  
}


export default AuthorizedHeader;
