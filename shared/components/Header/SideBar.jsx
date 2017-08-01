import React, { Component,PropTypes } from 'react';
import { Link } from 'react-router';
import auth from '../../services/auth';
import Logout from '../../container/Auth/Logout';
import moment from 'moment'
import { getnews,updatenews, updateActive}  from '../../redux/actions/actions'
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

class SideBar extends Component
{

  constructor(props, context) {


    super(props, context);
    this.state = {
      dashboard: '',
      chat: '',
      assignedchatsessions: '',
      abandonedchatsessions: '',
      resolvedchatsessions: '',
      summarychatsessions: '',
      customers: '',
      FBcustomers: '',
      agents: '',
      invitedagents: '',
      groups: '',
      subgroups: '',
      teams: '',
      notifications: '',
      widgetcode: '',
      reports: '',
      cannedresponses: '',
      instructionsforintegratingfacebook: '',
      fbpages: '',
      fbchat: '',
      companysettings: '',
      help: '',
      helpPopup: '',
      createGroup: '',
    };

  }

  componentDidMount(){

  //  alert("I was mounted", this.props.active);
   this.setState({
      dashboard: '',
      chat: '',
      assignedchatsessions: '',
      abandonedchatsessions: '',
      resolvedchatsessions: '',
      summarychatsessions: '',
      customers: '',
      FBcustomers: '',
      agents: '',
      invitedagents: '',
      groups: '',
      subgroups: '',
      teams: '',
      notifications: '',
      widgetcode: '',
      reports: '',
      cannedresponses: '',
      instructionsforintegratingfacebook: '',
      fbpages: '',
      fbchat: '',
      companysettings: '',
      help: '',
      createGroup: '',
      helpPopup: '',
    });
   switch (this.props.active) {
     case 'chat':
      this.setState({chat: ' active open '});  
       break;
     case 'dashboard':
      this.setState({dashboard: ' active open '});  
       break;
    case 'assignedchatsessions':
      this.setState({assignedchatsessions: ' active open '});  
       break;
    case 'resolvedchatsessions':
      this.setState({resolvedchatsessions: ' active open '});  
       break;
    case 'abandonedchatsessions':
      this.setState({abandonedchatsessions: ' active open '});  
       break;
      case 'summarychatsessions':
      this.setState({summarychatsessions: ' active open '});  
       break;
       case 'customers':
      this.setState({customers: ' active open '});  
       break;
       case 'FBcustomers':
      this.setState({FBcustomers: ' active open '});  
       break;
       case 'agents':
      this.setState({agents: ' active open '});  
       break;
       case 'invitedagents':
      this.setState({invitedagents: ' active open '});  
       break;
       case 'groups':
      this.setState({groups: ' active open '});  
       break;
       case 'subgroups':
      this.setState({subgroups: ' active open '});  
       break;case 'teams':
      this.setState({teams: ' active open '});  
       break;
       case 'notifications':
      this.setState({notifications: ' active open '});  
       break;
       case 'widgetcode':
      this.setState({widgetcode: ' active open '});  
       break;case 'reports':
      this.setState({reports: ' active open '});  
       break;
       case 'cannedresponses':
      this.setState({cannedresponses: ' active open '});  
       break;
       case 'instructionsforintegratingfacebook':
      this.setState({instructionsforintegratingfacebook: ' active open '});  
       break;
       case 'fbpages':
      this.setState({fbpages: ' active open '});  
       break;
       case 'fbchat':
      this.setState({fbchat: ' active open '});  
       break;
       case 'companyprofile':
      this.setState({companyprofile: ' active open '});  
       break;
        case 'help':
      this.setState({help: ' active open '});  
       break;
        case 'createGroup':
      this.setState({createGroup: ' active open '});  
       break;
        case 'helpPopup':
      this.setState({helpPopup: ' active open '});  
       break;
   
     default:
       break;
   }
  }



popupGuide()
{

  window.open('http://localhost:8000/userDocumentation/MainPage','Client Widget','width=700,height=600,resizable=yes')
}


  render()
  {
  return (
    
    <div>
        <div className="page-sidebar smallFix" style={{background: '#03363D'}}>
    <ReactTooltip />

            <ul className="page-sidebar-menu page-sidebar-menu-closed page-sidebar-menu-light" data-keep-expanded="false" data-auto-scroll="false" data-slide-speed="200" style={{flex: 1}}>
              <li className="sidebar-toggler-wrapper">
                  
                  <div className="sidebar-toggler">
                  </div>
                  
                </li>

              <li data-tip="Dashboard" className={"start" + this.state.dashboard} onClick={() => this.props.updateActive("dashboard")}>
               <Link to='/dashboard'>
                  <i className="icon-grid">
                  </i>
                  <span className="title">
                    Dashboard
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
               <li data-tip="Chat" className={this.state.chat} onClick={() => this.props.updateActive("chat")}>
                <Link to="/chat">
                  <i className="icon-bubble">
                  </i>
                  <span className="title">
                     Chat
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

               <li data-tip="Assigned Chat Sessions" className={this.state.assignedchatsessions} onClick={() => this.props.updateActive("assignedchatsessions")}>
                <Link to='/assignedchatsessions'>
                  <i className="icon-link">
                  </i>
                  <span className="title">
                    Assigned Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Abandoned Chat Sessions" className={this.state.abandonedchatsessions} onClick={() => this.props.updateActive("abandonedchatsessions")}>
                <Link to='/abandonedchatsessions'>
                  <i className="icon-link">
                  </i>
                  <span className="title">
                     Abandoned Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

               <li data-tip="Resolved Chat Sessions" className={this.state.resolvedchatsessions} onClick={() => this.props.updateActive("resolvedchatsessions")}>
                <Link to="/resolvedchatsessions">
                  <i className="icon-check">
                  </i>
                  <span className="title">
                     Resolved Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>



              <li data-tip="Summary of Chat Sessions" className={this.state.summarychatsessions} onClick={() => this.props.updateActive("summarychatsessions")}>
                <Link to="/summarychatsessions">
                  <i className="icon-phone">
                  </i>
                  <span className="title">
                     Summary of Chat Sessions
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Customer Directory" className={this.state.customers} onClick={() => this.props.updateActive("customers")}>
                <Link to="/customers">
                  <i className="icon-user">
                  </i>
                  <span className="title">
                     Customer Directory
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Facebook Customers" className={this.state.FBcustomers} onClick={() => this.props.updateActive("FBcustomers")}>
                <Link to="/FBcustomers">
                  <i className="icon-people">
                  </i>
                  <span className="title">
                     Facebook Customers
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

               {this.props.isAdmin == "Yes"?
              <li data-tip="Agents" className={this.state.agents} onClick={() => this.props.updateActive("agents")}>
                <Link to= '/agents'>
                  <i className="icon-user-following">
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

               <li data-tip="Invited Agents" className={this.state.invitedagents} onClick={() => this.props.updateActive("invitedagents")}>
                <Link to= '/invitedagents'>
                  <i className="icon-user-follow">
                  </i>
                  <span className="title">
                     Invited Agents
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

               <li data-tip="Groups" className={this.state.groups} onClick={() => this.props.updateActive("groups")}>
                <Link to='/groups'>
                  <i className="icon-people">
                  </i>
                  <span className="title">
                     Groups
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>
              <li data-tip="Sub Groups" className={this.state.subgroups} onClick={() => this.props.updateActive("subgroups")}>
                <Link to="/subgroups">
                  <i className="icon-envelope">
                  </i>
                  <span className="title">
                     Sub Groups
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

            <li data-tip="Teams" className={this.state.teams} onClick={() => this.props.updateActive("teams")}>
                <Link to='/teams'>
                  <i className="icon-people">
                  </i>
                  <span className="title">
                     Teams
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Notifications" className={this.state.notifications} onClick={() => this.props.updateActive("notifications")}>
                <Link to='/notifications'>
                  <i className="icon-bell">
                  </i>
                  <span className="title">
                   Notifications
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Widget" className={this.state.widgetcode} onClick={() => this.props.updateActive("widgetcode")}>
                <Link to='/widgetcode'>
                  <i className="icon-tag">
                  </i>
                  <span className="title">
                    Widget
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>

              <li data-tip="Reports" className={this.state.reports} onClick={() => this.props.updateActive("reports")}>
                <Link to="/reports">
                  <i className="icon-chart">
                  </i>
                  <span className="title">
                     Reports
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>


               <li data-tip="Canned Response" className={this.state.cannedresponses} onClick={() => this.props.updateActive("cannedresponses")}>
                <Link to="/cannedresponses">
                  <i className="icon-envelope">
                  </i>
                  <span className="title">
                     Canned Response
                  </span>
                  <span className="selected">
                  </span>
                </Link>
              </li>


   

               <li data-tip="helpPopup" className={this.state.helpPopup} onClick={() => this.props.updateActive("helpPopup")
               }>
            
               <button className="helpButton" onClick={this.popupGuide.bind(this)} > <i className="icon-question"></i> Help Guide</button>
             </li>




            {(this.props.isAdmin == "Yes" && this.props.companysettings && this.props.companysettings.enableFacebook == 'Yes')?
              <li data-tip="Facebook Integration" className={this.state.instructionsforintegratingfacebook} onClick={() => this.props.updateActive("instructionsforintegratingfacebook")}>
                <Link to="/instructionsforintegratingfacebook">
                  <i className="icon-info">
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
             { (this.props.isAdmin == "Yes" && this.props.companysettings && this.props.companysettings.enableFacebook == 'Yes') ?
              <li data-tip="Facebook Pages" className={this.state.fbpages} onClick={() => this.props.updateActive("fbpages")}>
                <Link to="/fbpages">
                  <i className="icon-social-facebook">
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
                {(this.props.companysettings && this.props.companysettings.enableFacebook == 'Yes') ?
                  <li data-tip="Facebook Chat" className={this.state.fbchat} onClick={() => this.props.updateActive("fbchat")}>
                <Link to="/fbchat">
                  <i className="icon-speech">
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
              <li data-tip="Company Settings" className={this.state.companyprofile} onClick={() => this.props.updateActive("companyprofile")}>
                <Link to="/companyprofile">
                  <i className="icon-settings">
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
</div>

 );
}
}


function mapStateToProps(state) {
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
    active:(state.dashboard.active),
  };
}
export default connect(mapStateToProps,{ getnews,updatenews, updateActive})(SideBar);
