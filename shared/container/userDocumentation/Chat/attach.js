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

class attach extends Component {

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
                  <Link to="/userDocumentation/Chat/attach" >AttachFiles</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
               <h1>Attachments in Chat</h1>
<p>Kibo Engage provides rich user experience when using chat feature to communicate with customers of their company. It provides the feature to attach files into chat.</p>
<p>To view Chat sessions, Click on "Chats" tab. Attachment button is located in bottom bar with the chat text box as shown:<br /><br /></p>
<p>We can attach any file which is residing on our computer by clicking on 'paperclip' button on right</p>
<p><img src="../../documentationPics/chatSimple.png" alt="" /> <br /><br /></p>
<p>It will show a file selector which you can use to attach any file and send it to customer.</p>
<p><br /><img src="../../documentationPics/fileAttach.png " alt="" />&nbsp; </p>
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

export default connect(mapStateToProps)(attach);
