import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
import moment from 'moment'
import { getnews,updatenews}  from '../../redux/actions/actions'
import { connect } from 'react-redux';


class SideBar extends Component
{

  constructor(props, context) {


    super(props, context);

  }

  render()
  {
  return (
   <div className="page-sidebar">

            <ul className="page-sidebar-menu">
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
                <Link to="/FBcustomers">
                  <i className="fa fa-users">
                  </i>
                  <span className="title">
                     Facebook Customers
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
                <Link to= '/invitedagents'>
                  <i className="fa fa-user">
                  </i>
                  <span className="title">
                     Invited Agents
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
                <Link to="/subgroups">
                  <i className="fa fa-envelope-square">
                  </i>
                  <span className="title">
                     Sub Groups
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

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
                <Link to='/notifications'>
                  <i className="fa fa-bell">
                  </i>
                  <span className="title">
                   Notifications
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li className="">
                <Link to='/widgetcode'>
                  <i className="fa fa-chain">
                  </i>
                  <span className="title">
                    Widget
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
           
            {(this.props.isAdmin == "Yes" && this.props.companysettings.enableFacebook == 'Yes')?
              <li className="">
                <Link to="/instructionsforintegratingfacebook">
                  <i className="fa fa-info-circle">
                  </i>
                  <span className="title">
                    Facebook Integration
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

                :<li></li>
                }
             { (this.props.isAdmin == "Yes" && this.props.companysettings.enableFacebook == 'Yes') ?
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

                :<li></li>
                }
                {(this.props.companysettings.enableFacebook == 'Yes') ? 
                  <li  className="">
                <Link to="/fbchat">
                  <i className="fa fa-facebook">
                  </i>
                  <span className="title">
                    Facebook Chat  
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li> : <li></li>
            }
              

            {this.props.isAdmin == "Yes"?
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

                :<li></li>
                }


          </ul>
  </div>

 );
}
}


function mapStateToProps(state) {
  console.log("I am auth header", state)
   return {

    team: (state.dashboard.team),
    agents:(state.dashboard.agents),
    deptagents:(state.dashboard.deptagents),
    agent :(state.dashboard.agent),
    errorMessage:(state.dashboard.errorMessage),
    channels :(state.dashboard.channels),
    userdetails:(state.dashboard.userdetails),
    news : (state.dashboard.news),
    companysettings:(state.dashboard.companysettings),
  };
}
export default connect(mapStateToProps,{ getnews,updatenews})(SideBar);
