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

class AddCannedResp extends Component {

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
                  <Link to="/userDocumentation/CannedResponses/AddCannedResp" >AddCannedResponses</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
                <div>
<h1>Add Canned Responses</h1>
<p>Support agents are on a typing spree when they are answering large number of customers and typing same thing over and over may bore them and reduce their productivity. To keep things up and up for your agents and maintain their pace, you can create well-formatted - predetermined responses for commonly asked questions. We call these 'Canned Responses'.<br /><br />Pre defined responses with shortcut keys can be added. Select "Canned Responses" tab from left bar. Select 'Add Canned Response" button located at the top</p>
<img src="../../documentationPics/CannedResponses.png " alt="" /> <br /><br />
<p>It will show a form. Fill the form by adding a short code and canned response.</p>
<img src="../../documentationPics/createCannedResponses.png" alt="" /> <br /><br />
<p>This canned response will be shown when the short code is typed in chat box when chatting with the customer. All short codes start with the '/' sign. It will help the agents to save time by typing long messages</p>
</div>
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

export default connect(mapStateToProps)(AddCannedResp);
