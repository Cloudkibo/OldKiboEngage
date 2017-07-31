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
class FBchatAttach extends Component {

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
                  <Link to="/userDocumentation/FBchat/FBchatAttach">FacebookChatAttachments</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
<h1>Attachments in Facebook Chat</h1>
<p>Kibo Engage provides rich user experience when using Facebook chat feature to communicate with facebook customers of their company page. It has almost all the features which are available in Facebook Messanger.</p>
<p>To view Facebook Chat sessions, Click on "Facebook Chat" tab. Attachment buttons are located in bottom bar with the chat text box as shown:<br /><br /></p>
<p>We can attach any file which is residing on our computer by clicking on 'paperclip' button on right</p><p><img src="../../documentationPics/fbPaperClip.png" alt="" /> <br /><br /></p>
<p>Lets take a closer look of all the types of attachments available in facebook chat.</p>
<p>It will show a file selector which you can use to attach any file and send it to customer.<br /><br />&nbsp;</p>
<p>&nbsp;We can also attach emojis, gifs or stickers from buttons attached at the right side of chat box area.</p>

<p><img src="../../documentationPics/fbEmojis.png " alt="" />
<br /><br /><br /><img src="../../documentationPics/fbChatsGifs.png " alt="" />&nbsp; <br /><br /></p>

<br /><br /><br /><img src="../../documentationPics/fbChatsStickers.png " alt="" />&nbsp; <br /><br />

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

export default connect(mapStateToProps)(FBchatAttach);
