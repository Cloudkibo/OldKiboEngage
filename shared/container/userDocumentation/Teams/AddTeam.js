import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import SideBar from '../../../components/Header/SideBar';
import auth from '../../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import PopoutWindow from 'react-popout';
import Popout from 'react-popout';
import ReactDom from 'react-dom';
import Popup from 'react-popup';

class AddTeam extends Component {

  constructor(props, context) {

    //call action to get user teams
    if(props.userdetails.accountVerified == "No"){
    console.log('not verified');
      browserHistory.push('/notverified');
    }

    const usertoken = auth.getToken();
    //console.log('componentWillMount is called');
    super(props, context);
  }

  render() {
    const token = auth.getToken()
    //console.log(token)

    return (
    
 <div className="page-content-wrapper">
            <div className="page-content">
              <h3 className ="page-title">User Guide </h3>
              <ul className="uk-breadcrumb">
                <li>
                  <i className="fa fa-home"/>
                  <Link to="/userDocumentation/MainPage"> UserGuide </Link>
                </li>
              
                <li>
                  <Link to="/userDocumentation/Teams/AddTeam">CreateTeam</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
              <h1>Add&nbsp;Team</h1>
<p>Teams comprises of more than one agent. Teams are assigned to groups at the time of group creation. The purpose of the team is to allow agents to work in collaboration for solving customer queries.</p>
<p>There can be two types of Teams:</p>
<p>1. Public Teams : Public Teams are visible to all agents within a company.Any agent can search and join a public team</p>
<p>2. Private Teams : Only the agent who created a private group can add other agents in his team</p>
<p>To add a new team, click on the "Teams" tab on the left hand side.<br />This will show the list of teams.<br />To create a new team, click on&nbsp;"Create Team" button at top.</p>
<p><img src="../../documentationPics/createTeamForm.png" alt="" /> <br /><br /></p>
<p>You will be shown a form to fill in details like team&nbsp;name, description etc.</p>
<p><img src="../../documentationPics/createTeamForm.png" alt="" />&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>

                    
                 
             
            </div>

          </div>
  
        </div>
             

  )
  }
}


function mapStateToProps(state) {

  return {
  userdetails:(state.dashboard.userdetails),
  agents:(state.dashboard.agents),
  deptagents:(state.dashboard.deptagents),
  teamdetails:(state.dashboard.teamdetails),
  channels :(state.dashboard.channels),
  onlineAgents:(state.dashboard.onlineAgents),
  news : (state.dashboard.news),
   }
}

export default connect(mapStateToProps)(AddTeam);
