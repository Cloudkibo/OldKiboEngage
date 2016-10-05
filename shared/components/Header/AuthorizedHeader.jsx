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
              
                  <li className="dropdown dropdown-extended dropdown-notification">
                      <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                      <i className="fa fa-bell-o"></i>
                          <span className="badge badge-default">7 </span>
                      </a>
                     <ul className="dropdown-menu">
                          <li className="external">
                            <h3><span className="bold">12 pending</span> notifications</h3>
                            <a href="extra_profile.html">view all</a>
                          </li>
                          <li>
                              <ul className="dropdown-menu-list scroller" style={{height: 250+'px'}} data-handle-color="#637283">
                                  <li>
                                    <a href="javascript:;">
                                          <span className="time">just now</span>
                                          <span className="details">
                                          <span className="label label-sm label-icon label-success">
                                          <i className="fa fa-plus"></i>
                                          </span>
                                          New user registered. </span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="javascript:;">
                                    <span className="time">3 mins</span>
                                    <span className="details">
                                    <span className="label label-sm label-icon label-danger">
                                    <i className="fa fa-bolt"></i>
                                    </span>
                                    Server #12 overloaded. </span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="javascript:;">
                                    <span className="time">10 mins</span>
                                    <span className="details">
                                    <span className="label label-sm label-icon label-warning">
                                    <i className="fa fa-bell-o"></i>
                                    </span>
                                    Server #2 not responding. </span>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="javascript:;">
                                    <span className="time">14 hrs</span>
                                    <span className="details">
                                    <span className="label label-sm label-icon label-info">
                                    <i className="fa fa-bullhorn"></i>
                                    </span>
                                    Application error. </span>
                                    </a>
                                  </li>
                                </ul>
                              </li>  
                     </ul>
                  </li>
           
             <li className="dropdown dropdown-user">
                        <a  href="javascript:;" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                          <span className ="username">
                               {this.props.name}
                          </span>
                          <i className="fa fa-angle-down"/>
                          </a>
                            <ul className="dropdown-menu">
                                <li>
                                  <Link to="/myprofile">
                                    <i className="fa fa-user"/>
                                    My Profile
                                  </Link>
                                </li> 
                                <li>
                                  <a href="/mymsg">
                                    <i className="fa fa-envelope-o"/>
                                    My Messages
                                  </a>
                                </li> 
                                
                                <li>

                                  <Link to="/mypickedchatsessions">
                                    <i className="fa fa-phone-square"/>
                                     My Picked Sessions
                                  </Link>
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