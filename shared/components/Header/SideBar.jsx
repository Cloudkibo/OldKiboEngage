import React from 'react';
import { Link } from 'react-router';

function SideBar() {
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
                <a href="index.html">
                  <i className="fa fa-envelope">
                  </i>      
                  <span className="title">
                    Messages
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li> 
              <li className="">
                <a href="index.html">
                  <i className="fa fa-chain">
                  </i>      
                  <span className="title">
                    Inprogress Calls
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>

              <li className="">
                <a href="index.html">
                  <i className="fa fa-chain-broken">
                  </i>      
                  <span className="title">
                     Abandoned Calls
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>

               <li className="">
                <a href="/completedcalls">
                  <i className="fa fa-check">
                  </i>      
                  <span className="title">
                     Completed Calls
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>


               <li className="">
                <a href="/completedcalls">
                  <i className="fa fa-reorder">
                  </i>      
                  <span className="title">
                     Consolidated Calls
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>

              <li className="">
                <a href="/completedcalls">
                  <i className="fa fa-phone-square">
                  </i>      
                  <span className="title">
                     Invite to Call
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>

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
                <a href="/completedcalls">
                  <i className="fa fa-bar-chart-o">
                  </i>      
                  <span className="title">
                     Reports
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>
              <li className="">
                <Link to="/messagechannel">
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
                <a href="/completedcalls">
                  <i className="fa fa-question-circle">
                  </i>      
                  <span className="title">
                     FAQs
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>


              <li className="">
                <a href="/completedcalls">
                  <i className="fa fa-cogs">
                  </i>      
                  <span className="title">
                     Settings
                  </span>      
                  <span className="selected">
                  </span>
                </a>
              </li>


          </ul>
  </div>

 );
}

export default SideBar;
