import React, { PropTypes,Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AuthorizedHeader from '../../components/Header/AuthorizedHeader.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import SideBar from '../../components/Header/SideBar';
import auth from '../../services/auth';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import PopoutWindow from 'react-popout';
import Popout from 'react-popout';

class MainPage extends Component {

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
              
              <div className="uk-card uk-card-body uk-card-default">
<p><strong>Getting Started</strong></p>
<ul>
<li><a title="Create a Group" href="/userDocumentation/Group/createGroup">Creating your First Group</a></li>
<li><a id="/userDocumentation/Agent/inviteAgent" title="Invite an Agent" href="/userDocumentation/Agent/inviteAgent">Inviting New Agent</a></li>
<li><a title="Integration with Facebook Messanger" href="/userDocumentation/FBchat/facebookIntegration">Integration with Facebook Messanger</a></li>
</ul>
<p><strong>All about Teams and Groups</strong></p>
<ul>
<li><a title="Create a Group" href="/userDocumentation/Teams/AddTeam">&nbsp;Adding a Team</a></li>
<li><a title="Edit a Team in Kibo Engage" href="/userDocumentation/Teams/EditTeam">Edit a Team in Kibo Engage</a></li>
<li><a title="Delete a Team in Kibo Engage" href="/userDocumentation/Teams/DeleteTeam">Delete a Team in Kibo Engage</a></li>
<li><a title="Adding a Group in Kibo Engage" href="/userDocumentation/Group/createGroup">Adding a Group in Kibo Engage</a></li>
<li><a title="Editing a Group" href="/userDocumentation/Group/EditGroup">Editing a Group</a></li>
<li><a title="Delete Group" href="/userDocumentation/Group/deleteGroup">Delete a Group</a></li>
<li><a title="Adding a Group in Kibo Engage" href="/userDocumentation/SubGroups/AddSubGroup">Adding a Sub Group in Kibo Engage</a></li>
<li><a title="Editing a Group" href="/userDocumentation/SubGroups/EditSubGroup">Editing a Sub Group</a></li>
<li><a title="Editing a Group" href="/userDocumentation/SubGroups/DeleteSubGroup">Delete a Sub Group</a></li>
</ul>
<p><strong>Everything about Conversations and Email</strong></p>
<ul>
<li><a title="Adding Canned Responses" href="/userDocumentation/CannedResponses/AddCannedResp">&nbsp;Implementing Canned Responses&nbsp;</a></li>
<li><a href="/userDocumentation/CannedResponses/EditCannedResponse">Edit a Canned Response</a></li>
<li><a href="/userDocumentation/CannedResponses/DeleteCannedResp">Delete a Canned REsponse</a></li>
<li><a title="Create a Group" href="/userDocumentation/CustomerDirectory/ViewCustDir">Send an email to Customer</a></li>
<li><a title="Editing a Group" href="/userDocumentation/Notifications/AddNotifications">Broadcast Notifications</a></li>
<li><a id="link-getting-started-step-2-inviting-new-staff" title="Chat with a facebook customer" href="/userDocumentation/FBchat/FBchatAttach">Chat with a facebook customer</a></li>
<li><a title="Assign a facebook chat session to an Agent" href="/userDocumentation/FBchat/assignFbChat">Assign a facebook chat session to an Agent</a></li>
<li><a title="Assign a chat session to an Agent" href="/userDocumentation/Chat/assignChat">Assign a chat session to an Agent</a></li>
<li><a title="Move a chat session to another sub group" href="/userDocumentation/Chat/resolveMove">Move/Resolve a chat session </a></li>
<li><a title="Attachments in Facebook Chats" href="/userDocumentation/FBchat/FBchatAttach">Attachments in Facebook Chats</a></li>
  <li><a title="Attachments in Chats" href="/userDocumentation/Chat/attach.js">Attachments in  Chats</a></li>
</ul>
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

export default connect(mapStateToProps)(MainPage);
