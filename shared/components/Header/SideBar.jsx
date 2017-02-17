import React, { Component,PropTypes } from 'react';

import { Link } from 'react-router';

class SideBar extends Component
{

  render()
  {
  return (
   <div className="page-sidebar navbar-collapse collapse">

            <ul className="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
              <li className="start">
               <Link to='/dashboard'>
                  <i className="fa fa-dashboard">
                  </i>
                  <span className="title">
                    Dashboard
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to='/notifications'>
                  <i className="fa fa-envelope">
                  </i>
                  <span className="title">
                   Notifications
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to='/assignedchatsessions'>
                  <i className="fa fa-chain">
                  </i>
                  <span className="title">
                    Assigned Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to='/newchatsessions'>
                  <i className="fa fa-chain-broken">
                  </i>
                  <span className="title">
                     Abandoned Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

               <li className="">
                <Link to="/resolvedchatsessions">
                  <i className="fa fa-check">
                  </i>
                  <span className="title">
                     Resolved Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>



              <li className="">
                <Link to="/summarychatsessions">
                  <i className="fa fa-phone-square">
                  </i>
                  <span className="title">
                     Summary of Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
             {this.props.isAdmin == "Yes"?
              <li className="">
                <Link to= '/agents'>
                  <i className="fa fa-user">
                  </i>
                  <span className="title">
                     Agents
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
                :<li></li>
                }
              <li className="">
                <Link to='/teams'>
                  <i className="fa fa-group">
                  </i>
                  <span className="title">
                     Teams
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to='/groups'>
                  <i className="fa fa-group">
                  </i>
                  <span className="title">
                     Groups
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to="/reports">
                  <i className="fa fa-bar-chart-o">
                  </i>
                  <span className="title">
                     Reports
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to="/customers">
                  <i className="fa fa-user">
                  </i>
                  <span className="title">
                     Customer Directory
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to="/messagechannels">
                  <i className="fa fa-envelope-square">
                  </i>
                  <span className="title">
                     Message Channels
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
               <li className="">
                <Link to="/cannedresponses">
                  <i className="fa fa-envelope-square">
                  </i>
                  <span className="title">
                     Canned Response
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to="/completedcalls">
                  <i className="fa fa-question-circle">
                  </i>
                  <span className="title">
                     FAQs
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to="/chat">
                  <i className="fa fa-comments-o">
                  </i>
                  <span className="title">
                     Chat
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to="/fbpages">
                  <i className="fa fa-facebook">
                  </i>
                  <span className="title">
                    Facebook Pages
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to="/fbchat">
                  <i className="fa fa-facebook">
                  </i>
                  <span className="title">
                    Facebook Chat
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li className="">
                <Link to="/companyprofile">
                  <i className="fa fa-cogs">
                  </i>
                  <span className="title">
                    Company Settings
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>


          </ul>
  </div>

 );
}
}

export default SideBar;
