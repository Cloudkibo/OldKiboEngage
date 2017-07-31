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

class resolveMove extends Component {

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
                  <Link to="/userDocumentation/Chat/resolveMove" >ResolveMove</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
        <h1>Resolve Chat</h1>
<p>Once the customer query is resolve, agent can mark that specific chat session as 'Resolved'.<br />When session is marked as 'Resolved' , chat session will disappear.<br />'Resolve' session button is available on top bar of both facebook chats and simple chats:<br /><br /></p>
<p><img src="../../documentationPics/resolveFB.png" alt="" /> <br /><br /></p>
<br />
<p><img src="../../documentationPics/resolvesimple.png " alt="" /> <br /><br /></p>
<br />
<h1>Move&nbsp;Chat Session</h1>
<p>You can also move chat session from one session to another channel.&nbsp;<br />This option is also available at top bar both in facebook chats and normal chats:</p>
<p><br /><img src="../../documentationPics/moveFB.png" alt="" />&nbsp;</p>
<br />
<p><br /><img src="../../documentationPics/moveSimple.png" alt="" />&nbsp;</p>
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

export default connect(mapStateToProps)(resolveMove);
