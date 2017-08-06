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
class assignFbChat extends Component {

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
                  <Link to="/userDocumentation/MainPage"> User Guide </Link>
                </li>
              
                <li>
                  <Link to="/userDocumentation/FBchat/assignFbChat">FacebookChats</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
<h1>Facebook Chat Sessions</h1>
<p>Companies can now easily integrate their KiboEngage Dashboard with their Facebook Page to communicate effectively with customers on Facebook. A facebook integration guide is given&nbsp;<a href="facebookIntegration">here</a><br /><br />Example: A chat could be in "Sales" group and "Car" can be a sub-group . Chat on this channel will be about sale of cars.<br /><br />As soon as the customer sends first chat message, all the online agents will see a new facebook chat session appeared. To view Facebook Chat sessions, Click on "Facebook Chat" tab&nbsp;<br /><br /></p>
<p><img src="../../documentationPics/FBChatsessions.png" alt="" /> <br /><br /></p>
<p>Lets take a closer look of all the areas of chat sessions window. A particular chat session displayed on left side shows customer name, Facebook page name, agent's name if the session is assigned to any agent</p>
<p><img src="../../documentationPics/fbChatCell.png " alt="" /> <br /><br /></p>
<p>Also there is a top bar which helps in assigning a chat session to a particular agent , &nbsp;or marking the session as "Resolved" . It also shows details like Customer name , agent name , status of sessio etc.</p>
<p><img src="../../documentationPics/fbChatTopBar.png " alt="" /> <br /><br /></p>
<p>If an agent is assigned to a chat session, it means he will be answering the queries of customers. However, all other agents which are part of team assigned to that page can silently view the chat. Any other agent can intervene in between if he/she has something more meaningful to assist the customer. A chat session is marked as 'Resolved' in the end when issue is resolved. Once the session is marked as 'Resolved' , it disappears from chat sessions list.</p>        
             
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

export default connect(mapStateToProps)(assignFbChat);
