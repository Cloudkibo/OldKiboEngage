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
class DeleteAgent extends Component {

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
                  <Link to="/dashboard"> User Guide </Link>
                </li>
              
               
                <li>
                  <Link to="/userDocumentation/Agent/DeleteAgent" >DeleteAgents</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
                <h1>Delete&nbsp;Agents</h1>
<p>Admins and Supervisors have the rights to delete any agent. This action cannot be undone. When an agent is deleted, chat session assigned to him/her becomes 'unassigned' . Chat session then needs to be picked up by any other agent.</p>
<p>To delete any Agent, click on the "Agents" tab on the left hand side. There are two ways to delete an Agent.<br /><br />1- You can select one or more agents by using checkbox located at the left of each row. After selecting the agent(s) , click on 'Delete' button as shown.&nbsp;On pressing it, it will show a confirmation box to confirm if you are ready to delete an agent.</p>
<img src="../../documentationPics/deleteAgent.png" alt="" /> <br /><br />
<p>&nbsp;2- Another way to delete an agent is to use 'bin' icon located on right side of the row for each agent. On pressing it, it will show a confirmation box to confirm if you are ready to delete an agent.</p>
<img src="../../documentationPics/deleteAgentBin.png" alt="" /> <br /><br />

             
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

export default connect(mapStateToProps)(DeleteAgent);
