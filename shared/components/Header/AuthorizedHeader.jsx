import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
export default class AuthorizedHeader extends Component
{

  render()
  {
    return (
    
      <div  className = "page-header navbar" >
        <div className="page-header-inner">
          <div className = "page-logo" >
              <a href = '/' >
                <h4> KiboEngage </h4>
              </a>
             
          </div >
          <div className="top-menu">
            <ul  className ="nav navbar-nav pull-right">
              <li className="dropdown dropdown-user">
                <a  href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                  <span className ="username">
                       {this.props.name}
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
                   <Logout roomid = {this.props.roomid}/>
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


export default AuthorizedHeader;