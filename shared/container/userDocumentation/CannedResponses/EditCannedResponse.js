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
class EditCannedResponse extends Component {

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
                  <Link to="/userDocumentation/CannedResponses/EditCannedResponse" >EditCannedResponse</Link>
                </li>
              </ul>
              <div className="uk-card uk-card-body uk-card-default">
             <h1>Edit&nbsp;Canned Responses</h1>
<p>Support agents are on a typing spree when they are answering large number of customers and typing same thing over and over may bore them and reduce their productivity.</p>
<p>To keep things up and up for your agents and maintain their pace, you can create well-formatted - predetermined responses for commonly asked questions. We call these 'Canned Responses'.</p>
<p>Canned Responses can be edited later after creation. Select "Canned Responses" tab from left bar.&nbsp;This will show the list of all the pre-defined Canned Responses.</p>
<p>&nbsp;Please&nbsp;use 'pencil' icon attached to every canned response to make ammendments.<br /><br /></p>
<img src="../../documentationPics/CannedResponses.png " alt="" /> <br /><br />
<p>It will show the form to edit short code or response of canned response. Once done, click on "Submit" button. If you donot want to make any change , click "Cancel"</p>
<img src="../../documentationPics/editCannedResponse.png " alt="" /> <br /><br />
<p>&nbsp;</p>
</div>
</div>
<div class="col-md-3">
<div class="sidebar-nav-fixed pull-right affix"><br />
<h3>&nbsp;</h3>
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

export default connect(mapStateToProps)(EditCannedResponse);
